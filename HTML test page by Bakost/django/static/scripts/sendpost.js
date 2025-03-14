//const objectElement = document.getElementById('svg-object');
//const svg = objectElement.getAttribute('data');
//const path_to_svg = object[data="${svg}"];

import { sharedData } from './carousel.js';


function modificatePoints(points) {
    // Проверка для второй и предпоследней точки
    if (points[1].y === points[2].y) {
        // Если точки 2 и 3 на одной горизонтальной линии
        if (!areCollinear(points[0], points[1], points[2])) {
            points[1].x = points[0].x;
        }
    } else if (points[1].x === points[2].x) {
        // Если точки 2 и 3 на одной вертикальной линии
        if (!areCollinear(points[0], points[1], points[2])) {
            points[1].y = points[0].y;
        }
    }

    // Проверка для предпоследней и последней точки
    if (points[points.length - 2].y === points[points.length - 3].y) {
        // Если точки предпоследняя и последняя на одной горизонтальной линии
        if (!areCollinear(points[points.length - 1], points[points.length - 2], points[points.length - 3])) {
            points[points.length - 2].x = points[points.length - 1].x;
        }
    } else if (points[points.length - 2].x === points[points.length - 3].x) {
        // Если точки предпоследняя и последняя на одной вертикальной линии
        if (!areCollinear(points[points.length - 1], points[points.length - 2], points[points.length - 3])) {
            points[points.length - 2].y = points[points.length - 1].y;
        }
    }

    return points;
}

// Проверка коллинеарности трех точек
function areCollinear(p1, p2, p3) {
    return (p2.y - p1.y) * (p3.x - p2.x) === (p3.y - p2.y) * (p2.x - p1.x);
}

// Функция формирования списка маршрута
function routeListForming(array) {
    const routeGroup = document.getElementById('routeGroup');

    routeGroup.innerHTML = '';

    const route = `
        <div class="divider"></div>
        <div class="route-points">
            <div style="text-align: center;"> Пункты маршрута: </div>
            <ul id="routeList"></ul>
        </div>
    `

    routeGroup.innerHTML += route;

    const routeList = document.getElementById('routeList');
    array.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        routeList.appendChild(li);
    });
}

function switchFloor(svgPath) {
    // Получаем все div, содержащие объекты этажей
    const parentDoc = window.parent.document;
    const floorDivs = parentDoc.querySelectorAll('div[data-floor-wrapper]');
    let flag = null;
    floorDivs.forEach(div => {
        const svgData = div.getAttribute('data-floor-wrapper'); // Уникальный идентификатор этажа
        //console.log(svgData, svgPath)
        if (svgData === svgPath) {
            // Показываем текущий этаж
            div.classList.add('active');
            flag = 1;
        } else if (flag !== 1) {
            // Скрываем остальные этажи
            div.classList.remove('active');
        }
        flag = null;
    });
    
}

// Функция для рисования маршрута на одном этаже с задержкой
function drawPathForFloor(points, svgPath) {
    return new Promise(resolve => {
        // Модифицируем точки перед рисованием
        const modifiedPoints = modificatePoints(points);

        const svgObject = document.querySelector(`object[data="${svgPath}"]`);
        const svgDoc = svgObject.contentDocument;
        const map = svgDoc.getElementById('map');
        const timePerUnitLength = 3;

        const polyline = svgDoc.createElementNS("http://www.w3.org/2000/svg", "polyline");
        const pointsAttr = modifiedPoints.map(point => `${point.x},${point.y}`).join(' ');
        polyline.setAttribute('points', pointsAttr);
        polyline.classList.add('line');
        map.appendChild(polyline);

        // Calculate line length
        function calculateTotalLength(points) {
            let totalLength = 0;
            for (let i = 1; i < points.length; i++) {
                const dx = points[i].x - points[i - 1].x;
                const dy = points[i].y - points[i - 1].y;
                totalLength += Math.sqrt(dx * dx + dy * dy);
            }
            return totalLength;
        }

        const totalLength = calculateTotalLength(modifiedPoints);
        const duration = totalLength * timePerUnitLength;

        polyline.style.strokeDasharray = totalLength;
        polyline.style.strokeDashoffset = totalLength;

        // Force redraw for Safari and mobile devices
        polyline.getBoundingClientRect();

        let startTime = null;

        // Функция анимации линии
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / duration;

            polyline.style.strokeDashoffset = Math.max(totalLength * (1 - progress), 0);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve(); // Animation completed
            }
        }

        // Добавляем задержку перед началом анимации
        setTimeout(() => {
            requestAnimationFrame(animate);
        }, 500); // 500 миллисекунд задержки
    });
}

// Функция для рисования маршрута между этажами
async function drawMultiFloorPath(dataPath, matrix) {
    const svgPaths = window.svgPaths; // Пути к SVG-этажам
    const pathsByFloor = { floor4: [], floor5: [] };

    // Определение текущего этажа на основе первой точки
    let currentFloor = null;
    const firstPoint = matrix.find(item => item[0] === dataPath[0]);

    if (firstPoint) {
        currentFloor = firstPoint[0].startsWith('4') ? 'floor4' : 'floor5';
    } else {
        if (dataPath[0].startsWith('4')) {
            currentFloor = 'floor4';
        } else if (dataPath[0].startsWith('5')) {
            currentFloor = 'floor5';
        } else {
            console.error('Не удалось определить этаж для первой точки маршрута:', dataPath[0]);
            return;
        }
    }

    // Разделение маршрута на этажи
    for (let i = 0; i < dataPath.length; i++) {
        const point = dataPath[i];

        if (point === 'F1' && dataPath[i + 1] === 'F2') {
            // Переход с 4 на 5 этаж
            const prevFloor = 'floor4';
            const nextFloor = 'floor5';
            i++; // Пропускаем следующий переходный пункт

            const matrixPoint = matrix.find(item => item[0] === point);
            if (matrixPoint) {
                pathsByFloor[prevFloor].push({ x: matrixPoint[1], y: matrixPoint[2] });
                pathsByFloor[nextFloor].push({ x: matrixPoint[1], y: matrixPoint[2] });
            }
            currentFloor = nextFloor;

        } else if (point === 'F2' && dataPath[i + 1] === 'F1') {
            // Переход с 5 на 4 этаж
            const prevFloor = 'floor5';
            const nextFloor = 'floor4';
            i++; // Пропускаем следующий переходный пункт

            const matrixPoint = matrix.find(item => item[0] === point);
            if (matrixPoint) {
                pathsByFloor[prevFloor].push({ x: matrixPoint[1], y: matrixPoint[2] });
                pathsByFloor[nextFloor].push({ x: matrixPoint[1], y: matrixPoint[2] });
            }
            currentFloor = nextFloor;

        } else {
            // Добавляем точки на текущий этаж
            const matrixPoint = matrix.find(item => item[0] === point);
            if (matrixPoint) {
                pathsByFloor[currentFloor].push({ x: matrixPoint[1], y: matrixPoint[2] });
            }
        }
    }

    const floorsWithRoutes = Object.keys(pathsByFloor)
    .filter(floor => pathsByFloor[floor].length > 0);

    const currentFloorRoutes = floorsWithRoutes.filter(floor => floor !== currentFloor);
    const otherFloorRoutes = floorsWithRoutes.filter(floor => floor === currentFloor);

    // Формируем итоговый порядок: сначала текущий этаж, затем остальные
    const floorOrder = [...currentFloorRoutes, ...otherFloorRoutes];


    // Рисование маршрутов по этажам
    for (const floor of floorOrder) {
        const points = pathsByFloor[floor];
        if (points.length > 1) {
            // Модифицируем точки перед рисованием
            const modifiedPoints = modificatePoints(points);

            // Переключаемся на нужный этаж
            //console.log("tut", svgPaths[floor])
            switchFloor(svgPaths[floor]);

            // Рисуем маршрут
            await drawPathForFloor(modifiedPoints, svgPaths[floor]);

            // Задержка перед переключением этажей
            await new Promise(resolve => setTimeout(resolve, 4000));
        }
    }
}



// Основная функция отправки данных
export function sendpost() {
    const csrftoken = window.parent.csrfToken;

    fetch('/map/calculate-route/', {
        method: 'POST',
        body: JSON.stringify({
            start: sharedData.startPointData,
            end: sharedData.endPointData,
        }),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(async data => {
            console.log('Path:', data.path);

            const matrix = [];
            
            // Получаем все object элементы для SVG этажей
            const svgObjects = document.querySelectorAll('object[data*="floor"]');

            for (const svgObject of svgObjects) {
                if (!svgObject) {
                    console.warn('SVG объект не найден.');
                    continue;
                }

                const svgDoc = svgObject.contentDocument;
                if (!svgDoc) {
                    console.warn('Контент документа отсутствует для:', svgObject);
                    continue;
                }

                const points_get = svgDoc.querySelectorAll('g[data-type="audienceornode"]');

                points_get.forEach(rect => {
                    let audience = rect.getAttribute('data-order');
                    let scale = parseFloat(svgDoc.getElementById('map_container').getAttribute('data-scale'));
                    let x_plus = parseFloat(svgDoc.getElementById('map_container').getAttribute('data-x'));
                    let y_plus = parseFloat(svgDoc.getElementById('map_container').getAttribute('data-y'));
                    let x_shift = parseFloat(rect.getAttribute('data-width'));
                    let y_shift = parseFloat(rect.getAttribute('data-height'));

                    let x = parseFloat(rect.getAttribute('data-x')) * scale + x_plus;
                    let y = parseFloat(rect.getAttribute('data-y')) * scale + y_plus;

                    if (audience[0] !== 'C' && audience[0] !== 'F') {
                        x += (x_shift * scale) / 2;
                        y += (y_shift * scale) / 2;
                    }

                    matrix.push([audience, x, y]);
                });
            }

            console.log('Matrix:', matrix);

            const initialFloor = data.path[1][0].startsWith('4') ? 'floor4' : 'floor5';
            //console.log("tutesche", window.svgPaths[initialFloor])
            switchFloor(window.svgPaths[initialFloor])

            // Передаем собранные точки и маршрут на отрисовку
            drawMultiFloorPath(data.path[1], matrix); // Рисуем маршрут
            routeListForming(data.path[1]); // Формируем список маршрута
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Сбрасываем данные маршрута
    sharedData.startPoint = null;
    sharedData.startPointData = null;
    sharedData.endPoint = null;
    sharedData.endPointData = null;
}