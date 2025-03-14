const objectElement = document.getElementById('svg-object')
const svg = objectElement.getAttribute('data')
const path_to_svg = `object[data="${svg}"]`

import { sharedData } from './carousel.js'

// Функция для рисовании кривой по массиву точек (old)
function drawPathCurve(array) {
    const svgObject = document.querySelector(path_to_svg)
    const svgDoc = svgObject.contentDocument
    const map = svgDoc.getElementById('map')
    const timePerUnitLength = 3
    const polyline = svgDoc.createElementNS("http://www.w3.org/2000/svg", "polyline")
    const points = array.map(point => `${point.x},${point.y}`).join(' ')

    polyline.setAttribute('points', points)
    polyline.classList.add('line')
    map.appendChild(polyline)

    // Функция для расчёта длины линии
    function calculateTotalLength(points) {
        let totalLength = 0
        for (let i = 1; i < points.length; i++) {
            const dx = points[i].x - points[i - 1].x
            const dy = points[i].y - points[i - 1].y
            totalLength += Math.sqrt(dx * dx + dy * dy)
        }
        return totalLength
    }

    const totalLength = calculateTotalLength(array)
    const duration = totalLength * timePerUnitLength

    polyline.style.strokeDasharray = totalLength
    polyline.style.strokeDashoffset = totalLength

    // Принудительная перерисовка для Safari и мобильных устройств
    polyline.getBoundingClientRect()

    let startTime = null

    function animate(timestamp) {
        if (!startTime) startTime = timestamp
        const progress = (timestamp - startTime) / duration

        polyline.style.strokeDashoffset = Math.max(totalLength * (1 - progress), 0)

        if (progress < 1) {
            requestAnimationFrame(animate)
        }
    }

    requestAnimationFrame(animate)
}

function routeListForming(array) {
    const routeGroup = document.getElementById('routeGroup')

    routeGroup.innerHTML = ''

    const route = `
        <div class="divider"></div>

        <div class="route-points">
            <div style="text-align: center;"> Пункты маршрута: </div>
            <ul id="routeList">
                <!-- Здесь будут отображаться пункты маршрута -->
            </ul>
        </div>
    `

    routeGroup.innerHTML += route

    const routeList = document.getElementById('routeList')
    routeList.innerHTML = ''
    array.forEach(item => {
        const li = document.createElement('li')
        li.textContent = item
        routeList.appendChild(li)
    })
}

// Функция для проверки коллинеарности точек (находятся ли три точки на одной прямой)
function areCollinear(p1, p2, p3) {
    return (p2.y - p1.y) * (p3.x - p2.x) === (p2.y - p3.y) * (p2.x - p1.x)
}

function modificatePoints(points) {
    // Проверка для второй и предпоследней точки
    if (points[1].y === points[2].y) {
        // Если точки 2 и 3 на одной горизонтальной линии
        if (!areCollinear(points[0], points[1], points[2])) {
            points[1].x = points[0].x
        }
    } else if (points[1].x === points[2].x) {
        // Если точки 2 и 3 на одной вертикальной линии
        if (!areCollinear(points[0], points[1], points[2])) {
            points[1].y = points[0].y
        }
    }

    // Проверка для предпоследней и последней точки
    if (points[points.length - 2].y === points[points.length - 3].y) {
        // Если точки предпоследняя и последняя на одной горизонтальной линии
        if (!areCollinear(points[points.length - 1], points[points.length - 2], points[points.length - 3])) {
            points[points.length - 2].x = points[points.length - 1].x
        }
    } else if (points[points.length - 2].x === points[points.length - 3].x) {
        // Если точки предпоследняя и последняя на одной вертикальной линии
        if (!areCollinear(points[points.length - 1], points[points.length - 2], points[points.length - 3])) {
            points[points.length - 2].y = points[points.length - 1].y
        }
    }

    return points
}

/*
export function sendpost() {
    const svgObject = document.querySelector(path_to_svg)
    const svgDoc = svgObject.contentDocument
    const csrftoken = window.parent.csrfToken
    //console.log('CSRF Token:', csrftoken)
    //console.log(formData)

    fetch('/map/calculate-route/', {
        method: 'POST',
        body: JSON.stringify({
            start: sharedData.startPointData,
            end: sharedData.endPointData
        }),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        return response.json()
    })
    .then(data => {
        console.log("Path:", data.path)
        //console.log(data.path[0], data.path[1])
        
        const points_get = svgDoc.querySelectorAll('g[data-type="audienceornode"]')

        console.log(points_get)
        
        const matrix = []

        points_get.forEach((rect) => {
            let audience = rect.getAttribute('data-order')

            let scale = parseFloat(svgDoc.getElementById('map_container').getAttribute('data-scale'))

            let x_plus = parseFloat(svgDoc.getElementById('map_container').getAttribute('data-x'))
            let y_plus = parseFloat(svgDoc.getElementById('map_container').getAttribute('data-y'))

            let x_shift = parseFloat(rect.getAttribute('data-width'))
            let y_shift = parseFloat(rect.getAttribute('data-height'))

            console.log("x_shift and y_shift", x_shift, y_shift)

            let x = parseFloat(rect.getAttribute('data-x'))
            let y = parseFloat(rect.getAttribute('data-y'))

            console.log(scale)

            x *= scale
            y *= scale

            x += x_plus
            y += y_plus

            if (audience[0] != "C") {
                x += x_shift * scale / 2
                y += y_shift * scale / 2
            }
            
            matrix.push([audience, x, y])
        })

        let points = []

        let data_herd = data.path[1]

        data_herd.forEach((currentElement, index) => {
            if (index < data_herd.length) { // Проверка, чтобы не выйти за границы массива
                for (let i = 0; i < matrix.length; i++) {
                    console.log(i, currentElement, matrix[i][0])
                    if (currentElement === matrix[i][0]) {
                        let x = matrix[i][1]
                        let y = matrix[i][2]
                        let startPointDrawArray = { x, y }

                        points.push(startPointDrawArray)
                    }
                }
            }
        })
        
        console.log("Points(before): ", points)

        modificatePoints(points)
       
        console.log("Points(after): ", points)
        

        drawPathCurve(points)
        routeListForming(data_herd)
        //console.log("Distance:", data.distance)
    })
    .catch(error => {
        console.error('Error:', error)
    })
    
    //console.log(startPointData, endPointData)
    sharedData.startPoint = null
    sharedData.startPointData = null
    sharedData.endPoint = null
    sharedData.endPointData = null
}
*/

function drawPathForFloor(points, svgPath, floorId) {
    return new Promise((resolve) => {
        const svgObject = document.querySelector(`object[data="${svgPath}"]`);
        const svgDoc = svgObject.contentDocument;
        const map = svgDoc.getElementById('map');
        const timePerUnitLength = 3;

        const polyline = svgDoc.createElementNS("http://www.w3.org/2000/svg", "polyline");
        const pointsAttr = points.map(point => `${point.x},${point.y}`).join(' ');
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

        const totalLength = calculateTotalLength(points);
        const duration = totalLength * timePerUnitLength;

        polyline.style.strokeDasharray = totalLength;
        polyline.style.strokeDashoffset = totalLength;

        // Force redraw for Safari and mobile devices
        polyline.getBoundingClientRect();

        let startTime = null;

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

        requestAnimationFrame(animate);
    });
}

async function drawMultiFloorPath(dataPath, matrix) {
    const svgPaths = {
        4: '{% static \'svg/floor4.svg\' %}',
        5: '{% static \'svg/floor5.svg\' %}',
    };

    const floors = {
        4: document.getElementById('floor4'),
        5: document.getElementById('floor5'),
    };

    const pathsByFloor = { 4: [], 5: [] };
    let currentFloor = 4; // Начинаем с 4 этажа

    // Разделение маршрута по этажам
    dataPath.forEach((point, index) => {
        if (point === 'F1') {
            currentFloor = 5; // Переход на 5 этаж
        } else if (point === 'F2') {
            currentFloor = 4; // Переход обратно на 4 этаж
        } else {
            const matrixPoint = matrix.find(item => item[0] === point);
            if (matrixPoint) {
                pathsByFloor[currentFloor].push({ x: matrixPoint[1], y: matrixPoint[2] });
            }
        }
    });

    // Рисование маршрута с анимацией по этажам
    for (const [floor, points] of Object.entries(pathsByFloor)) {
        if (points.length > 1) {
            // Показываем текущий этаж
            Object.values(floors).forEach(floorElem => floorElem.classList.remove('active'));
            floors[floor].classList.add('active');

            // Рисуем маршрут
            await drawPathForFloor(points, svgPaths[floor], floor);

            // Задержка перед переключением
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
}

export function sendpost() {
    const svgObject = document.querySelector(path_to_svg);
    const svgDoc = svgObject.contentDocument;
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
        .then(data => {
            console.log('Path:', data.path);

            const points_get = svgDoc.querySelectorAll('g[data-type="audienceornode"]');
            const matrix = [];

            points_get.forEach(rect => {
                let audience = rect.getAttribute('data-order');
                let scale = parseFloat(svgDoc.getElementById('map_container').getAttribute('data-scale'));
                let x_plus = parseFloat(svgDoc.getElementById('map_container').getAttribute('data-x'));
                let y_plus = parseFloat(svgDoc.getElementById('map_container').getAttribute('data-y'));
                let x_shift = parseFloat(rect.getAttribute('data-width'));
                let y_shift = parseFloat(rect.getAttribute('data-height'));

                let x = parseFloat(rect.getAttribute('data-x')) * scale + x_plus;
                let y = parseFloat(rect.getAttribute('data-y')) * scale + y_plus;

                if (audience[0] !== 'C') {
                    x += (x_shift * scale) / 2;
                    y += (y_shift * scale) / 2;
                }

                matrix.push([audience, x, y]);
            });

            console.log('Matrix:', matrix);

            drawMultiFloorPath(data.path[1], matrix); // Рисуем маршрут
            routeListForming(data.path[1]); // Формируем список маршрута
        })
        .catch(error => {
            console.error('Error:', error);
        });

    sharedData.startPoint = null;
    sharedData.startPointData = null;
    sharedData.endPoint = null;
    sharedData.endPointData = null;
}
