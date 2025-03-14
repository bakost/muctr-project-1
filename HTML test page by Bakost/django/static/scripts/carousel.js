import { sendpost } from "./sendpost.js"
import { waitForSVGLoad, clearPath, orderOfSelectedBox, disactivateBox } from '/map/static/svg/scripts/map.js'

export const sharedData = {
    startPoint: null,
    endPoint: null,
    startPointData: null,
    endPointData: null,
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed in carousel!')
    
    const images = {
        415: ['/map/static/images/415-1.jpg'],
        416: ['/map/static/images/416-2.jpg'],
        418: ['/map/static/images/418-1.jpg', '/map/static/images/418-2.jpg', '/map/static/images/418-3.jpg'],
        419: ['/map/static/images/419-1.jpg', '/map/static/images/419-2.jpg', '/map/static/images/419-3.jpg'],
        421: ['/map/static/images/421-1.jpg', '/map/static/images/421-2.jpg', '/map/static/images/421-3.jpg'],
        422: ['/map/static/images/422-1.jpg', '/map/static/images/423-2.jpg', '/map/static/images/423-3.jpg'],
        423: ['/map/static/images/423-1.jpg', '/map/static/images/423-2.jpg', '/map/static/images/423-3.jpg'],
        424: ['/map/static/images/424-1.jpg', '/map/static/images/424-2.jpg', '/map/static/images/424-3.jpg'],
        425: ['/map/static/images/425-1.jpg', '/map/static/images/426-2.jpg', '/map/static/images/426-3.jpg'],
        426: ['/map/static/images/426-1.jpg', '/map/static/images/426-2.jpg', '/map/static/images/426-3.jpg'],
        427: ['/map/static/images/427-1.jpg', '/map/static/images/427-2.jpg', '/map/static/images/427-3.jpg'],
        428: ['/map/static/images/428-1.jpg', '/map/static/images/428-2.jpg', '/map/static/images/428-3.jpg'],
        429: ['/map/static/images/429-1.jpg', '/map/static/images/429-2.jpg'],
        430: ['/map/static/images/430-1.jpg', '/map/static/images/429-2.jpg'],
        431: ['/map/static/images/431-1.jpg', '/map/static/images/429-2.jpg'],
        432: ['/map/static/images/432-1.jpg', '/map/static/images/429-2.jpg'],
        433: ['/map/static/images/433-1.jpg', '/map/static/images/429-2.jpg'],
        434: ['/map/static/images/434-1.jpg', '/map/static/images/434-2.jpg', '/map/static/images/434-3.jpg'],
        "K": ['/map/static/images/kletka-1.jpg', '/map/static/images/kletka-2.jpg', '/map/static/images/kletka-3.jpg'],
        "co-working": ['/map/static/images/co-working-1.jpg'], // не используется
        "WC1": ['/map/static/images/WC1.jpg'],
        "WC2": ['/map/static/images/WC2.jpg'],
        511: ['/map/static/images/511-1.jpg'],
        512: ['/map/static/images/512-1.jpg'],
        513: ['/map/static/images/513-1.jpg', '/map/static/images/513-2.jpg'],
        515: ['/map/static/images/515-2.jpg', '/map/static/images/515-3.jpg', '/map/static/images/515-4.jpg'],
        516: ['/map/static/images/516-1.jpg', '/map/static/images/516-2.jpg', '/map/static/images/516-3.jpg'],
        "518a": ['/map/static/images/518a-1.jpg']
    }
    
    function loadImages() {
        Object.values(images).forEach(imageArray => {
            imageArray.forEach(src => {
                console.log('Loading:', src)
                const img = new Image()
                img.src = src
                img.onload = () => {
                    console.log('Loaded:', src)
                }
                img.onerror = () => {
                    console.error('Error loading:', src)
                }
            })
        })
    }

    setTimeout(() => {
        loadImages()
        console.log('Load images success!')
    }, 1000) 

    const objectElement = document.getElementById('svg-object')
    const svg = objectElement.getAttribute('data')
    const path_to_svg = `object[data="${svg}"]`

    const svgObject = document.querySelector(path_to_svg)

    let currentImageIndex = 1 // Начинаем с клонированного первого изображения
    const carouselImagesContainer = document.querySelector('.carousel-images')
    const carouselContainer = document.getElementById('carousel-container')

    const svgObjects = document.querySelectorAll('object[data*="floor"]');

    // Проходим по каждому объекту <object>
    svgObjects.forEach((svgObject) => {
        svgObject.addEventListener('load', () => {
            const svgDoc = svgObject.contentDocument;
            if (svgDoc) {
                // Найти все элементы аудитории с атрибутом data-order
                const audienceElements = svgDoc.querySelectorAll('[data-order]');
                audienceElements.forEach((element) => {
                    element.style.cursor = 'pointer'; // Устанавливаем курсор для интерактивности
                    element.addEventListener('click', (event) => {
                        const audienceId = element.getAttribute('data-order');
                        const rect = element.getBoundingClientRect();
                        const x = rect.left + window.scrollX;
                        const y = rect.top + window.scrollY;

                        // Показываем карусель с соответствующими изображениями
                        currentSvgDoc = svgDoc;
                        showCarousel(audienceId, x, y);
                    });
                });
            } else {
                console.error('SVG content could not be accessed.');
            }
        });
    });

    // Функции для карусели
    function updateCarousel(instant = false) {
        const offset = -currentImageIndex * 100;
        carouselImagesContainer.style.transition = instant ? 'none' : 'transform 0.5s ease-in-out';
        carouselImagesContainer.style.transform = `translateX(${offset}%)`;
    }

    function getImagesForAudience(audienceId) {
        return images[audienceId] || [];
    }

    function showCarouselAtPosition(offsetX, offsetY) {
        carouselContainer.style.display = 'block';
        const containerHeight = carouselContainer.offsetHeight;
        const containerWidth = carouselContainer.offsetWidth;
        const pageHeight = window.innerHeight;
        const pageWidth = window.innerWidth;

        let correctedX = offsetX;
        let correctedY = offsetY;

        if (offsetX + containerWidth > pageWidth) correctedX = pageWidth - containerWidth;
        if (offsetY + containerHeight > pageHeight) correctedY = pageHeight - containerHeight;
        if (correctedX < 0) correctedX = 0;
        if (correctedY < 0) correctedY = 0;

        carouselContainer.style.left = `${correctedX}px`;
        carouselContainer.style.top = `${correctedY}px`;
    }

    function showCarousel(audienceId, x, y) {
        const audienceImages = getImagesForAudience(audienceId);
        if (audienceImages.length === 0) {
            console.warn(`No images found for audience ${audienceId}`);
            return;
        }
    
        currentImageIndex = 1;
        carouselImagesContainer.innerHTML = '';
    
        const lastClone = document.createElement('img');
        lastClone.src = audienceImages[audienceImages.length - 1];
        lastClone.className = 'carousel-image';
        carouselImagesContainer.appendChild(lastClone);
    
        audienceImages.forEach((src) => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'carousel-image';
            carouselImagesContainer.appendChild(img);
        });
    
        const firstClone = document.createElement('img');
        firstClone.src = audienceImages[0];
        firstClone.className = 'carousel-image';
        carouselImagesContainer.appendChild(firstClone);
    
        showCarouselAtPosition(x, y);
    
        document.getElementById('from-here-button').setAttribute('data-order', audienceId);
        document.getElementById('to-here-button').setAttribute('data-order', audienceId);
    
        updateCarousel(true);
    }
    

    waitForSVGLoad(svgObject, (svgDoc) => {
        console.log('Carousel fully loaded and parsed in svg!');
        const map = svgDoc.getElementById('map') 

        const rects = svgDoc.querySelectorAll('rect[data-order]')
        //console.log('Found rects:', rects)

        map.addEventListener('click', (event) => {
            if (!carouselContainer.contains(event.target)) {
                carouselContainer.style.display = 'none'
            }
        })

        rects.forEach(rect => {
    //document.querySelectorAll('rect[data-order]').forEach(rect => {
            rect.addEventListener('click', (event) => {
                //console.log('Rect clicked:', rect)
                event.stopPropagation()
                const audienceId = rect.getAttribute('data-order')
                const { clientX: x, clientY: y } = event
                showCarousel(audienceId, x, y)
            })
        })
    })
    
    document.addEventListener('click', (event) => {
        if (isDragging) return
        if (!carouselContainer.contains(event.target)) {
            carouselContainer.style.display = 'none'
        }
    })

    let currentSvgDoc = null; // Переменная для хранения текущего SVG-документа

    document.getElementById('from-here-button').addEventListener('click', function () {
        const audienceId = this.getAttribute('data-order');
        if (!currentSvgDoc) {
            console.error('SVG document is not loaded.');
            return;
        }

        console.log(currentSvgDoc)

        const box = currentSvgDoc.querySelector(`#audience${audienceId}[data-order="${audienceId}"]`);
        if (box) {
            console.log('Элемент найден:', box);

            const rect = box.getBoundingClientRect();
            const x = rect.x + 25;
            const y = rect.y + 25;

            sharedData.startPoint = { x, y };
            sharedData.startPointData = box.dataset.order;

            if (sharedData.endPoint) {
                clearPath();
                sendpost();
            }

            console.log('Route from audience:', audienceId);
        } else {
            console.warn(`Элемент с ID audience${audienceId} не найден.`);
        }
    });

    document.getElementById('to-here-button').addEventListener('click', function () {
        const audienceId = this.getAttribute('data-order');
        if (!currentSvgDoc) {
            console.error('SVG document is not loaded.');
            return;
        }

        console.log(currentSvgDoc)

        const box = currentSvgDoc.querySelector(`#audience${audienceId}[data-order="${audienceId}"]`);
        if (box) {
            console.log('Элемент найден:', box);

            const rect = box.getBoundingClientRect();
            const x = rect.x + 25;
            const y = rect.y + 25;

            sharedData.endPoint = { x, y };
            sharedData.endPointData = box.dataset.order;

            if (sharedData.startPoint) {
                clearPath();
                sendpost();
            }

            console.log('Route to audience:', audienceId);
        } else {
            console.warn(`Элемент с ID audience${audienceId} не найден.`);
        }
    });

    function nextImage() {
        currentImageIndex++
        updateCarousel()

        if (currentImageIndex === carouselImagesContainer.children.length - 1) {
            // Плавно переключаемся на последний клон, затем мгновенно переносим на начало
            setTimeout(() => {
                currentImageIndex = 1
                updateCarousel(true) // Мгновенное переключение без анимации
            }, 500)
        }
    }

    function prevImage() {
        currentImageIndex--
        updateCarousel()

        if (currentImageIndex === 0) {
            // Плавно переключаемся на первый клон, затем мгновенно переносим на конец
            setTimeout(() => {
                currentImageIndex = carouselImagesContainer.children.length - 2
                updateCarousel(true)
            }, 500)
        }
    }

    // Обработчики для кнопок карусели
    document.getElementById('next-button').addEventListener('click', nextImage);
    document.getElementById('prev-button').addEventListener('click', prevImage);

    // Обработчик для кнопки закрытия
    document.getElementById('close-carousel-button').addEventListener('click', closeCarousel);

    function closeCarousel() {
        const carouselContainer = document.getElementById('carousel-container');
        carouselContainer.style.display = 'none'; // Скрыть карусель
    
        const svgDoc = svgObject.contentDocument;
        const map = svgDoc.getElementById('map');
        var boxes = map.querySelectorAll(".room-box");
        boxes.forEach(box_find => {
            if (box_find.dataset.order === orderOfSelectedBox) {
                disactivateBox(box_find);
            }
        });
    }

    // Добавление управления клавишами
    let isLocked = false; // Флаг для блокировки

    document.addEventListener('keydown', (event) => {
        const carouselContainer = document.getElementById('carousel-container');
        
        // Проверяем, видна ли карусель
        if (carouselContainer.style.display !== 'none' && !isLocked) {
            isLocked = true; // Блокируем последующие нажатия

            if (event.key === 'ArrowRight') {
                // Переключение на следующую картинку
                const nextButton = document.getElementById('next-button');
                nextButton.classList.add('pressed');

                // Удаление класса через 200 мс
                setTimeout(() => {
                    nextButton.classList.remove('pressed');
                }, 200);

                nextImage();
            } else if (event.key === 'ArrowLeft') {
                // Переключение на предыдущую картинку
                const prevButton = document.getElementById('prev-button');
                prevButton.classList.add('pressed');

                // Удаление класса через 200 мс
                setTimeout(() => {
                    prevButton.classList.remove('pressed');
                }, 200);

                prevImage();
            } else if (event.key === 'Escape') {
                // Закрытие карусели
                closeCarousel();
            }

            // Разблокировка кнопок через 1500 мс
            setTimeout(() => {
                isLocked = false;
            }, 600);
        }
    })
    
    // Добавляем поддержку прокрутки на мобильных устройствах
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let endX = 0;
    let isDraggingCarousel = false;
    let isDraggingPhoto = false;
    let isDragging = false;

    // Перемещение карусели с помощью мыши или касания
    let dragStartX = 0
    let dragStartY = 0

    // Начальная позиция карусели
    let initialLeft = 0
    let initialTop = 0

    // Обработчик начала перетаскивания мышью
    function startDrag(event) {
        isDragging = true

        if (event.type === 'mousedown') {
            dragStartX = event.clientX
            dragStartY = event.clientY
        }

        const rect = carouselContainer.getBoundingClientRect()
        initialLeft = rect.left
        initialTop = rect.top

        // Отключаем прокрутку страницы
        event.preventDefault()
    }

    // Обработчик движения мыши
    function onDrag(event) {
        if (!isDragging) return;
    
        let currentX = 0;
        let currentY = 0;
    
        if (event.type === 'mousemove') {
            currentX = event.clientX;
            currentY = event.clientY;
        }
    
        const deltaX = currentX - dragStartX;
        const deltaY = currentY - dragStartY;
    
        const newLeft = initialLeft + deltaX;
        const newTop = initialTop + deltaY;
    
        // Получаем размеры карусели и экрана
        const containerWidth = carouselContainer.offsetWidth;
        const containerHeight = carouselContainer.offsetHeight;
        const pageWidth = window.innerWidth;
        const pageHeight = window.innerHeight;
    
        // Проверяем горизонтальные границы
        if (newLeft >= 0 && newLeft + containerWidth <= pageWidth) {
            carouselContainer.style.left = `${newLeft}px`;
        }
        // Проверяем вертикальные границы
        if (newTop >= 0 && newTop + containerHeight <= pageHeight) {
            // Двигаем карусель внутри допустимой области
            carouselContainer.style.top = `${newTop}px`;
        } else if (newTop < 0) {
            // Ограничиваем выход выше верхней границы
            carouselContainer.style.top = `0px`;
        } else if (newTop + containerHeight > pageHeight) {
            // Ограничиваем выход за нижнюю границу
            carouselContainer.style.top = `${pageHeight - containerHeight}px`;
        }
    
        // Отключаем прокрутку страницы
        event.preventDefault();
    }    

    // Обработчик завершения перетаскивания
    function endDrag() {
        isDragging = false
    }

    // Привязываем события к контейнеру карусели
    carouselContainer.addEventListener('mousedown', startDrag)
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', endDrag)

   

    // Поддержка перемещения карусели и прокрутки фотографий на мобильных устройствах
    carouselContainer.addEventListener('touchstart', (event) => {
        const target = event.target;

        // Если цель - кнопка, не выполняем обработку
        if (target.tagName === 'BUTTON' || target.closest('button')) return;

        if (target === carouselImagesContainer || carouselImagesContainer.contains(target)) {
            // Начало скролла фотографий
            startX = event.touches[0].clientX; // Начальная позиция X
            isDraggingPhoto = true; // Устанавливаем флаг для обработки скроллинга фото
            endX = startX; // Инициализируем endX
            carouselImagesContainer.style.transition = 'none';
        } else {
            // Начало перемещения карусели
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;

            const rect = carouselContainer.getBoundingClientRect();
            currentX = rect.left + window.scrollX;
            currentY = rect.top + window.scrollY;

            isDraggingCarousel = true;
            carouselContainer.style.transition = 'none';
        }

        // Отключаем стандартное поведение жестов, если обработка выполняется
        event.preventDefault();
    });

    carouselContainer.addEventListener('touchmove', (event) => {
        // Если неактивны флаги перетаскивания, ничего не делаем
        if (!isDraggingPhoto && !isDraggingCarousel) return;
    
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;
    
        if (isDraggingPhoto) {
            // Логика скролла фотографий
            endX = event.touches[0].clientX; // Конечная позиция X
            const deltaX = endX - startX; // Разница между начальной и текущей позицией
    
            // Обновляем смещение для показа текущего положения
            carouselImagesContainer.style.transform = `translateX(${(-currentImageIndex * 100) + (deltaX / carouselImagesContainer.offsetWidth * 100)}%)`;
        } else if (isDraggingCarousel) {
            // Логика перемещения карусели
            const deltaX = touchX - startX;
            const deltaY = touchY - startY;
    
            const newLeft = currentX + deltaX;
            const newTop = currentY + deltaY;
    
            // Получаем размеры контейнера карусели и экрана
            const containerWidth = carouselContainer.offsetWidth;
            const containerHeight = carouselContainer.offsetHeight;
            const pageWidth = window.innerWidth;
            const pageHeight = window.innerHeight;
    
            // Проверяем горизонтальные границы
            if (newLeft >= 0 && newLeft + containerWidth <= pageWidth) {
                carouselContainer.style.left = `${newLeft}px`;
            }
            // Проверяем вертикальные границы
            if (newTop >= 0 && newTop + containerHeight <= pageHeight) {
                // Двигаем карусель внутри допустимой области
                carouselContainer.style.top = `${newTop}px`;
            } else if (newTop < 0) {
                // Ограничиваем выход выше верхней границы
                carouselContainer.style.top = `0px`;
            } else if (newTop + containerHeight > pageHeight) {
                // Ограничиваем выход за нижнюю границу
                carouselContainer.style.top = `${pageHeight - containerHeight}px`;
            }
        }
    
        // Отключаем стандартное поведение жестов
        event.preventDefault();
    });

    carouselContainer.addEventListener('touchend', () => {
        if (isDraggingPhoto) {
            // Завершаем скролл фотографий
            const deltaX = endX - startX; // Общая разница за движение
            const threshold = carouselImagesContainer.offsetWidth / 3; // Порог для переключения

            carouselImagesContainer.style.transition = 'transform 0.5s ease-in-out'; // Плавный переход

            if (deltaX > threshold) {
                // Если смещение вправо превышает порог
                prevImage();
            } else if (deltaX < -threshold) {
                // Если смещение влево превышает порог
                nextImage();
            } else {
                // Возвращаем карусель на место, если движение недостаточно
                updateCarousel();
            }

            // Сбрасываем флаг
            isDraggingPhoto = false;
        }

        if (isDraggingCarousel) {
            // Завершаем перемещение карусели
            carouselContainer.style.transition = 'transform 0.3s ease-in-out';

            isDraggingCarousel = false;
        }

        // Сброс начальных координат
        startX = 0;
        startY = 0;
    });
})
