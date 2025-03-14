const map = document.getElementById('map');

var boxes = document.querySelectorAll(".room-box");
var orderOfSelectedBox = -1;

let startPoint = null;
let endPoint = null;
let startPointData = null;
let endPointData = null;


function activateBox(box) {
	box.classList.add("room-box-activated");
	orderOfSelectedBox = box.dataset.order;
}


function disactivateBox(box) {
	if (box) {
		box.classList.remove("room-box-activated");
	}
	orderOfSelectedBox = -1;
}


// Функция для рисования линии
function drawPath(start, end) {
	// Создаем элемент <line>
	const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

	line.setAttribute('x1', start.x);
	line.setAttribute('y1', start.y);
	line.setAttribute('x2', end.x);
	line.setAttribute('y2', end.y);

	line.classList.add('line'); // Применяем класс для стилей

	//line.className = 'line'; // Применяем класс для стилей
	//line.setAttribute('visibility', 'visible');
	//line.setAttribute('stroke', 'black');  // Цвет линии
	//line.setAttribute('stroke-width', '2');  // Толщина линии
	
	// Добавляем линию в SVG контейнер
    map.appendChild(line);
}


// Функция для рисовании кривой по массиву точек
function drawPathCurve(array) {
	// Создаем элемент <polyline>
    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");

    //const points = array.map(point => point.join(',')).join(' ');
	console.log(array);

	// Преобразуем массив точек в строку для атрибута points
	const points = array.map(point => `${point.x},${point.y}`).join(' ');

	// Убираем последний пробел
	//points = points.trim();

    // Задаем атрибуты для линии
	polyline.classList.add('line');
    polyline.setAttribute('points', points);
    //polyline.setAttribute('stroke', 'black'); // Цвет линии
    //polyline.setAttribute('stroke-width', '2'); // Толщина линии
    //polyline.setAttribute('fill', 'none'); // Не заполняем форму

    // Добавляем линию в SVG
    map.appendChild(polyline);
}


// Функция для очистки линий
function clearPath() {
	startPoint = null;
	startPointData = null;
	endPoint = null;
	endPointData = null;
	const lines = document.querySelectorAll('.line');
	lines.forEach(line => line.remove());
	disactivateBox(boxes[orderOfSelectedBox]);
}


// Функция для отключения ПКМ в боксе svg
map.addEventListener('contextmenu', function(event) {
	event.preventDefault();
	clearPath();
});


// Вспомогательная функция для обработчика проверок клика не на блока и последующего удаления кривой
map.addEventListener('click', function(event) {
	// Проверяем, был ли клик не на блоке
	let isBlockClicked = false;

	boxes.forEach(box => {
		if (event.target === box) isBlockClicked = true; // Если кликнули на блок, устанавливаем флаг
	});

	if (!isBlockClicked) clearPath();
});


//document.addEventListener('DOMContentLoaded', function () {
    //const csrftoken = Cookies.get('csrftoken'); // Получаем CSRF-токен
    //console.log('CSRF Token:', csrftoken);
//});


// Основная функция обработки клика на box
boxes.forEach(function(box) {
	box.addEventListener("click", function(event) {
		if (orderOfSelectedBox != box.dataset.order) {
			if (orderOfSelectedBox >= 0) {
				disactivateBox(boxes[orderOfSelectedBox]);
			}
			activateBox(box);
		}

		//const rect = box.getBoundingClientRect(); // Получаем координаты контейнера
		//const x = event.clientX - rect.left; // Высчитываем координаты относительно контейнера
		//const y = event.clientY - rect.top;
		//const x1 = event.pageX // Высчитываем координаты 
		//const y1 = event.pageY

		//console.log(x1, y1)






		/*








		let x = box.getBoundingClientRect().x + 25; // Высчитываем координаты 
		let y = box.getBoundingClientRect().y + 25;

		//console.log(box.getAttribute('data-order'))
		//console.log(box.dataset.order)

		//console.log("")
		
		if (!startPoint) {
			startPoint = { x, y };
			startPointData = box.dataset.order;
			//console.log('Начальная точка:', startPoint);
		} else if (!endPoint) {
			endPoint = { x, y };
			endPointData = box.dataset.order;
			//console.log('Конечная точка:', endPoint);
			//drawPath(startPoint, endPoint);

			//const formData = new FormData();
			//formData.append('start', startPointData);
			//formData.append('end', endPointData);
			
			//const csrftoken = document.getElementById('csrf-token').value;
			//console.log(Cookies);
			//const csrftoken = Cookies.get('csrftoken');

			//const csrftoken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

			//const csrftoken = document.querySelector('object[data-csrf]').getAttribute('data-csrf');

			const csrftoken = window.parent.csrfToken;
			//console.log('CSRF Token:', csrftoken);
			//console.log(formData);

			fetch('/map/calculate-route/', {
				method: 'POST',
				body: JSON.stringify({
                    start: startPointData,
                    end: endPointData
                }),
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrftoken
				}
			})
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json(); // Преобразуем ответ в JSON
			})
			.then(data => {
				console.log("Path:", data.path);
				//console.log(data.path[0], data.path[1]);

				const matrix = [
					[100, 93], //1 * 0 0 +100 +93
					[100, 168],//2 * 0 75 +100 +93
					[225, 93], //3 * 125 0 +100 +93
					[225, 168],//4 * 125 75 +100 +93
					[355, 168],//5 * 255 75 +100 +93
					[355, 248],//6 * 255 155 +100 +93
					[355, 308],//7 * 255 215 +100 +93
					[100, 358],//8 * 0 265 +100 +93
					[225, 358],//9 * 125 265 +100 +93

					[100, 248],//10 * 25 180 +75 +68
					[225, 248],//11 * 150 180 +75 +68
					[100, 308],//12 * 25 240 +75 +68
					[225, 308] //13 * 150 240 +75 +68
				];

				let points = [];

				data.path.forEach((currentElement, index) => {
					if (index < data.path.length) { // Проверка, чтобы не выйти за границы массива
						//const nextElement = data.path[index + 1];
						//console.log(`Current: ${currentElement}, Next: ${nextElement}`);
						//console.log(`Current: ${currentElement}`);

						x = matrix[currentElement][0];
						y = matrix[currentElement][1];
						let startPointDrawArray = { x, y };

						//x = matrix[nextElement][0];
						//y = matrix[nextElement][1];
						//let endPointDrawArray = { x, y };

						//drawPath(startPointDrawArray, endPointDrawArray);
						points.push(startPointDrawArray);
						//console.log(`Current: x:${matrix[currentElement][0]}, y:${matrix[currentElement][1]}, Next: x:${matrix[nextElement][0]}, y:${matrix[nextElement][1]}`);
						//console.log(`Current: x:${matrix[currentElement - 1][0]}, y:${matrix[currentElement - 1][1]}`);
					}
				});

				drawPathCurve(points);
				//console.log("Distance:", data.distance);
			})
			.catch(error => {
				console.error('Error:', error);
			});
			


			//console.log(startPointData, endPointData);
			startPoint = endPoint;
			startPointData = endPointData;
			endPoint = null;
			endPointData = null;
		}






		
		*/
	});	
});


/*

DEBUG

*/


/*
document.onclick = (e) => {
	console.log("(", e.pageX, ", ", e.pageY, ")");
};
*/