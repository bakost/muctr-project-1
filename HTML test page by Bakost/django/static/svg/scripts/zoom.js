var svgDOM = document.getElementById("map");
var scale = 1.5;

var _zoomScaleSpeed = 0.004;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed in zoom!');

	let isDragging = false;
	let isZooming = false;
	let startTouchPositions = [];
	let touchStartDistance = 0;
	let currentViewBox = { x: 0, y: 0, width: 0, height: 0 };

	const ZOOM_MAX = 4;
	const ZOOM_MIN = 0.8;

	// Проверка видимости элемента
    function isElementVisible(element) {
        return element && window.getComputedStyle(element).opacity !== "0";
    }

	// Функция для расчета расстояния между двумя точками
	function getDistance(touch1, touch2) {
		return Math.sqrt(
			Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2)
		);
	}

	// Функция для расчета средней точки между двумя точками
	function getMidPoint(touch1, touch2) {
		return {
			clientX: (touch1.clientX + touch2.clientX) / 2,
			clientY: (touch1.clientY + touch2.clientY) / 2
		};
	}

	// Универсальная функция зума
	function zoom(focusPoint, scaleFactor) {
		if (!isElementVisible(svgDOM)) return; // Проверяем видимость элемента

		const viewBox = svgDOM.viewBox.baseVal;
		const rect = svgDOM.getBoundingClientRect();

		// Текущий масштаб
		const currentScale = rect.width / viewBox.width;
		const newScale = Math.min(Math.max(currentScale * scaleFactor, ZOOM_MIN), ZOOM_MAX);

		// Новый размер viewBox
		const targetWidth = rect.width / newScale;
		const targetHeight = rect.height / newScale;

		// Координаты фокусной точки относительно viewBox
		const focusX = (focusPoint.clientX - rect.left) * (viewBox.width / rect.width) + viewBox.x;
		const focusY = (focusPoint.clientY - rect.top) * (viewBox.height / rect.height) + viewBox.y;

		const deltaX = focusX - viewBox.x;
		const deltaY = focusY - viewBox.y;

		// Применение изменений
		viewBox.x += deltaX * (1 - targetWidth / viewBox.width);
		viewBox.y += deltaY * (1 - targetHeight / viewBox.height);
		viewBox.width = targetWidth;
		viewBox.height = targetHeight;
	}

	// Универсальная обработка начала событий
	function startDrag(event) {
		if (!isElementVisible(svgDOM)) return; // Проверяем видимость элемента

		const viewBox = svgDOM.viewBox.baseVal;
		isDragging = true;
		isZooming = false;

		if (event.touches?.length === 1 || event.type === 'mousedown') {
			// Перемещение
			const touch = event.touches ? event.touches[0] : event;
			startTouchPositions = [{ clientX: touch.clientX, clientY: touch.clientY }];
			currentViewBox = { x: viewBox.x, y: viewBox.y, width: viewBox.width, height: viewBox.height };
		}

		if (event.touches?.length === 2) {
			// Зумирование
			isZooming = true;
			touchStartDistance = getDistance(event.touches[0], event.touches[1]);
			startTouchPositions = Array.from(event.touches);
		}

		event.preventDefault();
	}

	// Универсальная обработка движения
	function drag(event) {
		if (!isElementVisible(svgDOM)) return; // Проверяем видимость элемента

		const viewBox = svgDOM.viewBox.baseVal;

		if (!isDragging) return;

		if (isZooming && event.touches?.length === 2) {
			// Обработка мультитач-зумирования
			const currentDistance = getDistance(event.touches[0], event.touches[1]);
			const scaleFactor = currentDistance / touchStartDistance;

			// Средняя точка между пальцами
			const midPoint = getMidPoint(event.touches[0], event.touches[1]);

			zoom(midPoint, scaleFactor); // Зум относительно средней точки
			touchStartDistance = currentDistance; // Обновляем расстояние
		} else if (!isZooming && (event.touches?.length === 1 || event.type === 'mousemove')) {
			// Обработка перемещения
			const touch = event.touches ? event.touches[0] : event;
			const deltaX = (startTouchPositions[0].clientX - touch.clientX) * (viewBox.width / svgDOM.clientWidth);
			const deltaY = (startTouchPositions[0].clientY - touch.clientY) * (viewBox.height / svgDOM.clientHeight);

			viewBox.x = currentViewBox.x + deltaX;
			viewBox.y = currentViewBox.y + deltaY;
		}

		event.preventDefault();
	}

	// Универсальная обработка завершения событий
	function endDrag(event) {
		isDragging = false;
		isZooming = false;
	}

	// Настройка колёсика мыши (десктоп)
	svgDOM.addEventListener('wheel', (event) => {
		if (!isElementVisible(svgDOM)) return; // Проверяем видимость элемента

		event.preventDefault();
		const scaleFactor = event.deltaY < 0 ? 1.1 : 0.9;
		zoom(event, scaleFactor);
	});

	// Настройка событий для touch и mouse
	svgDOM.addEventListener('touchstart', startDrag);
	svgDOM.addEventListener('mousedown', startDrag);
	svgDOM.addEventListener('touchmove', drag);
	svgDOM.addEventListener('mousemove', drag);
	svgDOM.addEventListener('touchend', endDrag);
	svgDOM.addEventListener('mouseup', endDrag);
	svgDOM.addEventListener('mouseleave', endDrag);



	const parentDoc = window.parent.document;

	const zoomInButton = parentDoc.getElementById('zoom-in');
	const zoomOutButton = parentDoc.getElementById('zoom-out');

	// Обновление состояния кнопок в зависимости от текущего масштаба
	function updateZoomButtons() {
		if (!isElementVisible(svgDOM)) return; // Проверяем видимость элемента

		const viewBox = svgDOM.viewBox.baseVal;
		const rect = svgDOM.getBoundingClientRect();
		const currentScale = rect.width / viewBox.width;

		zoomInButton.disabled = currentScale >= ZOOM_MAX;
		zoomOutButton.disabled = currentScale <= ZOOM_MIN;
	}

	// Функции для кнопок зума
	zoomInButton.addEventListener('click', () => {
		if (!isElementVisible(svgDOM)) return; // Проверяем видимость элемента

		const rect = svgDOM.getBoundingClientRect();

		// Центрировать зум относительно середины экрана
		const focusPoint = { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 };
		zoom(focusPoint, 1.1); // Увеличить масштаб
		updateZoomButtons();
	});

	zoomOutButton.addEventListener('click', () => {
		if (!isElementVisible(svgDOM)) return; // Проверяем видимость элемента
		
		const rect = svgDOM.getBoundingClientRect();

		// Центрировать зум относительно середины экрана
		const focusPoint = { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 };
		zoom(focusPoint, 0.9); // Уменьшить масштаб
		updateZoomButtons();
	});

	// Обновление состояния кнопок при загрузке страницы
	updateZoomButtons();

	// Обновление кнопок при зумировании колёсиком или мультитачем
	svgDOM.addEventListener('wheel', () => updateZoomButtons());
	svgDOM.addEventListener('touchmove', () => updateZoomButtons());
})


