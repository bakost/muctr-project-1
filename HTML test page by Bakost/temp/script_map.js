let startPoint = null;
let endPoint = null;

const floorPlan = document.getElementById('floor-plan');
const map = document.getElementById('map');

// Обработчик клика на карту
map.addEventListener('click', function(event) {
    const rect = map.getBoundingClientRect(); // Получаем координаты контейнера
    const x = event.clientX - rect.left; // Высчитываем координаты относительно контейнера
    const y = event.clientY - rect.top;

    if (!startPoint) {
        startPoint = { x, y };
        console.log('Начальная точка:', startPoint);
    } else if (!endPoint) {
        endPoint = { x, y };
        console.log('Конечная точка:', endPoint);
        drawPath(startPoint, endPoint);
        startPoint = endPoint;
        endPoint = null;
    } /*else {
        startPoint = null;
        endPoint = null;
        clearPath();
    }*/
});

map.addEventListener('contextmenu', function(event) {
    startPoint = null;
    endPoint = null;
    clearPath();
});

// Функция для рисования линии
function drawPath(start, end) {
    const path = document.createElement('div');
    path.className = 'line';
    
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    path.style.width = length + 'px';
    path.style.transform = `translate(${start.x}px, ${start.y}px) rotate(${Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI}deg)`;
    
    map.appendChild(path); // Добавляем линию в контейнер
}

// Функция для очистки линий
function clearPath() {
    const lines = document.querySelectorAll('.line');
    lines.forEach(line => line.remove());
}
