#<script src="{% static 'scripts/karousel.js' %}"></script>

# carousel.py
import js
from pyscript import Element

def on_dom_content_loaded(evt):
    js.console.log('DOM fully loaded and parsed')

    # Переменные
    start_point = None
    end_point = None
    start_point_data = None
    end_point_data = None

    # Получаем ссылку на SVG-объект
    svg_object = js.document.querySelector('object[data="/map/static/svg/map.svg"]')

    current_image_index = 1  # Начинаем с клонированного первого изображения
    carousel_images_container = js.document.querySelector('.carousel-images')
    carousel_container = js.document.getElementById('carousel-container')

    images = {
        0: ['/map/static/images/419-1.jpg', '/map/static/images/419-2.jpg', '/map/static/images/419-3.jpg'],
        1: ['/map/static/images/421-1.jpg', '/map/static/images/421-2.jpg', '/map/static/images/421-3.jpg'],
        2: ['/map/static/images/422-1.jpg', '/map/static/images/423-2.jpg', '/map/static/images/423-3.jpg'],
        3: ['/map/static/images/423-1.jpg', '/map/static/images/423-2.jpg', '/map/static/images/423-3.jpg'],
        4: ['/map/static/images/424-1.jpg', '/map/static/images/424-2.jpg', '/map/static/images/424-3.jpg'],
        5: ['/map/static/images/425-1.jpg', '/map/static/images/426-2.jpg', '/map/static/images/426-3.jpg'],
        6: ['/map/static/images/426-1.jpg', '/map/static/images/426-2.jpg', '/map/static/images/426-3.jpg'],
        7: ['/map/static/images/427-1.jpg', '/map/static/images/427-2.jpg', '/map/static/images/427-3.jpg'],
        8: ['/map/static/images/428-1.jpg', '/map/static/images/428-2.jpg', '/map/static/images/428-3.jpg'],
        9: ['/map/static/images/429-1.jpg', '/map/static/images/429-2.jpg'],
        10: ['/map/static/images/430-1.jpg', '/map/static/images/429-2.jpg'],
        11: ['/map/static/images/431-1.jpg', '/map/static/images/429-2.jpg'],
        12: ['/map/static/images/432-1.jpg', '/map/static/images/429-2.jpg'],
        13: ['/map/static/images/433-1.jpg', '/map/static/images/429-2.jpg'],
        14: ['/map/static/images/co-working-1.jpg'],
        15: ['/map/static/images/kletka-1.jpg', '/map/static/images/kletka-2.jpg', '/map/static/images/kletka-3.jpg']
    }

    # Загрузка изображений
    for image_array in images.values():
        for src in image_array:
            print('Loading:', src)  # Выводим сообщение о загрузке
            img = js.document.createElement('img')
            img.src = src
            
            def onload(evt):
                print('Loaded:', src)  # Выводим сообщение об успешной загрузке
            img.onload = onload

            def onerror(evt):
                print('Error loading:', src)  # Выводим сообщение об ошибке загрузки
            img.onerror = onerror

    def update_carousel(instant=False):
        global current_image_index, carousel_images_container  # Убедитесь, что эти переменные определены в глобальной области видимости
        offset = -current_image_index * 100
        carousel_images_container.style.transition = 'none' if instant else 'transform 0.5s ease-in-out'
        carousel_images_container.style.transform = f'translateX({offset}%)'
    
    def next_image(evt):
        global current_image_index
        current_image_index += 1
        update_carousel()

        if current_image_index == len(carousel_images_container.children) - 1:
            # Плавно переключаемся на последний клон, затем мгновенно переносим на начало
            js.setTimeout(lambda: set_start_image(), 500)

    def set_start_image():
        global current_image_index
        current_image_index = 1
        update_carousel(True)  # Мгновенное переключение без анимации

    def prev_image(evt):
        global current_image_index
        current_image_index -= 1
        update_carousel()

        if current_image_index == 0:
            # Плавно переключаемся на первый клон, затем мгновенно переносим на конец
            js.setTimeout(lambda: set_end_image(), 500)

    def set_end_image():
        global current_image_index
        current_image_index = len(carousel_images_container.children) - 2
        update_carousel(True)

    # Привязка обработчиков событий
    js.document.getElementById('next-button').addEventListener('click', next_image)
    js.document.getElementById('prev-button').addEventListener('click', prev_image)

    def get_images_for_audience(audience_id):
        return images.get(audience_id, [])
    
    def show_carousel(audience_id, x, y):
        audience_images = get_images_for_audience(audience_id)
        if not audience_images:
            js.console.warn(f'No images found for audience {audience_id}')
            return

        global current_image_index
        current_image_index = 1
        carousel_images_container.innerHTML = ''  # Очищаем контейнер

        # Создаем клон последнего изображения (для бесконечной прокрутки)
        last_clone = js.document.createElement('img')
        last_clone.src = audience_images[-1]
        last_clone.className = 'carousel-image'
        carousel_images_container.appendChild(last_clone)

        # Добавляем все оригинальные изображения
        for src in audience_images:
            img = js.document.createElement('img')
            img.src = src
            img.className = 'carousel-image'
            carousel_images_container.appendChild(img)

        # Создаем клон первого изображения (для бесконечной прокрутки)
        first_clone = js.document.createElement('img')
        first_clone.src = audience_images[0]
        first_clone.className = 'carousel-image'
        carousel_images_container.appendChild(first_clone)

        # Проверка границ страницы
        container_height = carousel_container.offsetHeight
        container_width = carousel_container.offsetWidth
        page_height = js.window.innerHeight  # Высота страницы
        page_width = js.window.innerWidth  # Ширина страницы

        offset_y = y - container_height - 20  # Позиционирование вверх
        offset_x = x - container_width / 2  # Позиционирование по центру

        # Если карусель выходит за верхнюю границу страницы, позиционируем ее вниз
        if offset_y < 0:
            offset_y = y + 20  # Позиционирование вниз

        # Проверка нижней границы страницы
        if offset_y + container_height > page_height:
            offset_y = page_height - container_height - 20  # Позиционирование выше нижней границы

        # Проверка левой границы страницы
        if offset_x < 0:
            offset_x = 0  # Установить на левую границу

        # Проверка правой границы страницы
        if offset_x + container_width > page_width:
            offset_x = page_width - container_width  # Установить на правую границу

        carousel_container.style.display = 'block'
        carousel_container.style.left = f'{offset_x}px'
        carousel_container.style.top = f'{offset_y}px'

        js.document.getElementById('from-here-button').setAttribute('data-order', audience_id)
        js.document.getElementById('to-here-button').setAttribute('data-order', audience_id)

        update_carousel(True)  # Начальная настройка без анимации

    svg_object.addEventListener('load', lambda evt: handle_svg_load(evt))

    def handle_svg_load(evt):
        svg_doc = svg_object.contentDocument
        map_element = svg_doc.getElementById('map')
        rects = svg_doc.querySelectorAll('rect[data-order]')
        # js.console.log('Found rects:', rects)  # Можно раскомментировать для отладки

        map_element.addEventListener('click', lambda event: handle_map_click(event))

        for rect in rects:
            rect.addEventListener('click', lambda event, rect=rect: handle_rect_click(event, rect))

    def handle_map_click(event):
        if not carousel_container.contains(event.target):
            carousel_container.style.display = 'none'  # Скрываем карусель

    def handle_rect_click(event, rect):
        event.stopPropagation()
        audience_id = rect.getAttribute('data-order')
        x = event.clientX
        y = event.clientY
        show_carousel(audience_id, x, y)

    js.document.addEventListener('click', lambda event: handle_click(event))

    def handle_click(event):
        if not carousel_container.contains(event.target):
            carousel_container.style.display = 'none'  # Скрываем карусель
            
    def draw_path_curve(array):
        svg_doc = svg_object.contentDocument
        map_element = svg_doc.getElementById('map')

        # Создаем элемент <polyline>
        polyline = svg_doc.createElementNS("http://www.w3.org/2000/svg", "polyline")

        print(array)

        # Преобразуем массив точек в строку для атрибута points
        points = ' '.join(f"{point['x']},{point['y']}" for point in array)

        # Задаем атрибуты для линии
        polyline.classList.add('line')
        polyline.setAttribute('points', points)

        # Добавляем линию в SVG
        map_element.appendChild(polyline)
    
    
    Element('from-here-button').element.addEventListener('click', lambda event: from_here_button_click())

    def from_here_button_click():
        svg_doc = svg_object.contentDocument

        audience_id = Element('from-here-button').element.getAttribute('data-order')
        
        box = svg_doc.querySelector(f'#audience{audience_id}[data-order="{audience_id}"]')

        if box:
            print('Элемент найден:', box)

        x = box.getBoundingClientRect().x + 25
        y = box.getBoundingClientRect().y + 25
        
        global startPoint, startPointData
        startPoint = {'x': x, 'y': y}
        startPointData = box.dataset.order

        if endPoint:
            csrftoken = window.parent.csrfToken

            fetch('/map/calculate-route/', {
                'method': 'POST',
                'body': JSON.stringify({
                    'start': startPointData,
                    'end': endPointData
                }),
                'headers': {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                }
            }).then(lambda response: response_handler(response, svg_doc))

            startPoint = None
            startPointData = None
            endPoint = None
            endPointData = None

        print('Route from audience:', audience_id)

    def response_handler(response, svg_doc):
        if not response.ok:
            raise Exception('Network response was not ok')

        return response.json().then(lambda data: process_data(data, svg_doc))

    def process_data(data, svg_doc):
        print("Path:", data['path'])

        points_get = svg_doc.querySelectorAll('g[data-type="audienceornode"]')
        print(points_get)

        matrix = []

        for rect in points_get:
            x = float(rect.getAttribute('data-x')) + 100
            y = float(rect.getAttribute('data-y')) + 93
            matrix.append([x, y])

        print(matrix)

        points = []

        for index, current_element in enumerate(data['path']):
            if index < len(data['path']):  # Проверка, чтобы не выйти за границы массива
                x = matrix[current_element][0]
                y = matrix[current_element][1]
                start_point_draw_array = {'x': x, 'y': y}

                points.append(start_point_draw_array)

        draw_path_curve(points)

    Element('to-here-button').element.addEventListener('click', lambda event: to_here_button_click())

    def to_here_button_click():
        svg_doc = svg_object.contentDocument

        audience_id = Element('to-here-button').element.getAttribute('data-order')

        box = svg_doc.querySelector(f'#audience{audience_id}[data-order="{audience_id}"]')

        if box:
            print('Элемент найден:', box)

        x = box.getBoundingClientRect().x + 25
        y = box.getBoundingClientRect().y + 25

        global endPoint, endPointData
        endPoint = {'x': x, 'y': y}
        endPointData = box.dataset.order

        if startPoint:
            csrftoken = window.parent.csrfToken

            fetch('/map/calculate-route/', {
                'method': 'POST',
                'body': JSON.stringify({
                    'start': startPointData,
                    'end': endPointData
                }),
                'headers': {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                }
            }).then(lambda response: response_handler(response, svg_doc))

            startPoint = None
            startPointData = None
            endPoint = None
            endPointData = None

        print('Route to audience:', audience_id)

    def response_handler(response, svg_doc):
        if not response.ok:
            raise Exception('Network response was not ok')

        return response.json().then(lambda data: process_data(data, svg_doc))

    def process_data(data, svg_doc):
        print("Path:", data['path'])

        points_get = svg_doc.querySelectorAll('g[data-type="audienceornode"]')
        print(points_get)

        matrix = []

        for rect in points_get:
            x = float(rect.getAttribute('data-x')) + 100
            y = float(rect.getAttribute('data-y')) + 93
            matrix.append([x, y])

        print(matrix)

        points = []

        for index, current_element in enumerate(data['path']):
            if index < len(data['path']):  # Проверка, чтобы не выйти за границы массива
                x = matrix[current_element][0]
                y = matrix[current_element][1]
                start_point_draw_array = {'x': x, 'y': y}

                points.append(start_point_draw_array)

        draw_path_curve(points)

    Element('close-carousel').element.addEventListener('click', lambda event: close_carousel())

    def close_carousel():
        carousel_container = Element('carousel-container').element
        carousel_container.style.display = 'none'  # Скрыть карусель
    
    # Поддержка прокрутки на мобильных устройствах
    start_x = 0
    end_x = 0

    def touch_start(event):
        global start_x
        start_x = event.touches[0].clientX  # Запоминаем начальную позицию касания
        Element('carousel-images-container').element.style.transition = 'none'  # Убираем анимацию во время перемещения
        event.preventDefault()  # Отключаем прокрутку страницы

    def touch_move(event):
        global end_x
        end_x = event.touches[0].clientX  # Запоминаем конечную позицию касания
        delta_x = end_x - start_x  # Вычисляем смещение

        # Применяем смещение к контейнеру
        carousel_images_container = Element('carousel-images-container').element
        carousel_images_container.style.transform = f'translateX({(-current_image_index * 100) + (delta_x / carousel_images_container.offsetWidth * 100)}%)'

        event.preventDefault()  # Отключаем прокрутку страницы

    def touch_end():
        global current_image_index
        delta_x = end_x - start_x  # Разница между начальной и конечной позициями
        threshold = Element('carousel-images-container').element.offsetWidth / 3  # Порог для переключения

        # Сбрасываем стили после завершения жеста
        carousel_images_container = Element('carousel-images-container').element
        carousel_images_container.style.transition = 'transform 0.5s ease-in-out'  # Плавный переход

        if delta_x > threshold:
            prev_image()  # Если перемещение вправо больше порога, переключаем на предыдущее изображение
        elif delta_x < -threshold:
            next_image()  # Если перемещение влево больше порога, переключаем на следующее изображение
        else:
            update_carousel()  # Если смещение меньше порога, возвращаем текущее изображение на место

        # Сбрасываем позицию после переключения
        def reset_position():
            if current_image_index == 0:
                current_image_index = Element('carousel-images-container').element.children.length - 2  # Мгновенно переключаем на последний клон
                update_carousel(True)
            elif current_image_index == Element('carousel-images-container').element.children.length - 1:
                current_image_index = 1  # Мгновенно переключаем на первый клон
                update_carousel(True)

        window.setTimeout(reset_position, 500)

    # Подключаем обработчики событий
    Element('carousel-images-container').element.addEventListener('touchstart', touch_start)
    Element('carousel-images-container').element.addEventListener('touchmove', touch_move)
    Element('carousel-images-container').element.addEventListener('touchend', touch_end)

# Добавляем обработчик события DOMContentLoaded
js.document.addEventListener('DOMContentLoaded', on_dom_content_loaded)