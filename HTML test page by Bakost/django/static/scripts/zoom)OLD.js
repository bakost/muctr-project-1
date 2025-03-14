import { waitForSVGLoad } from '/map/static/svg/scripts/map.js';

let isDragging = false;
let startX, startY;
let scale = 1.5;
let offsetX = 0;
let offsetY = 0; 

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed in zoom!');

    const objectElement = document.getElementById('svg-object');
    const svg = objectElement.getAttribute('data');
    const path_to_svg = `object[data="${svg}"]`;
    const svgObject = document.querySelector(path_to_svg);

    waitForSVGLoad(svgObject, (svgDoc) => {
        console.log('Zoom fully loaded and parsed in svg!');

        const map = svgDoc.getElementById('map');

        // Функция для перемещения SVG элемента
        function dragMove(e) {
            if (!isDragging) return;
            e.preventDefault();

            // Вычисляем новые координаты
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            // Обновляем сдвиг карты
            offsetX += dx;
            offsetY += dy;

            // Применяем трансформацию с учетом сдвига
            map.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

            // Обновляем начальные координаты для следующего шага
            startX = e.clientX;
            startY = e.clientY;
        }

        // Начало перетаскивания
        map.addEventListener("mousedown", function (e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
        });

        // Завершение перетаскивания
        map.addEventListener("mouseup", function () {
            isDragging = false;
        });

        // Перемещение при перемещении мыши
        map.addEventListener("mousemove", dragMove);

        // Зум с помощью колесика мыши
        map.addEventListener("wheel", function (e) {
            e.preventDefault();

            const ZOOM_MAX = 4;
            const ZOOM_MIN = 0.25;
            const zoomScaleSpeed = 0.005; // Ускорение зума

            const rect = objectElement.getBoundingClientRect(); // Получаем размеры карты
            const mouseX = e.clientX - rect.left;  // Координаты курсора относительно карты
            const mouseY = e.clientY - rect.top;

            const scaleBefore = scale;  // Сохраняем текущий масштаб

            // Изменение масштаба
            scale += e.deltaY * zoomScaleSpeed;
            scale = Math.min(Math.max(ZOOM_MIN, scale), ZOOM_MAX);

            // Если масштаб изменился
            if (scale !== scaleBefore) {
                // Рассчитываем масштабный коэффициент
                const scaleRatio = scale / scaleBefore;

                // Рассчитываем новое смещение, чтобы зумировать в точке курсора
                //offsetX -= (scaleRatio - 1) * e.clientX;  // Корректировка сдвига по оси X
                //offsetY -= (scaleRatio - 1) * e.clientY;  // Корректировка сдвига по оси Y
                offsetX = 0
                offsetY = 0
                
                // Применяем трансформацию: сдвиг и масштаб
                map.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
            }
        })
    })
})
