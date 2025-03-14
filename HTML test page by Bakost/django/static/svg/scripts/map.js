export var orderOfSelectedBox = "0"

let startPoint = null
let endPoint = null
let startPointData = null
let endPointData = null

// Функция ожидания подключения модуля SVG
export function waitForSVGLoad(svgObject, callback) {
    const interval = setInterval(() => {
        const svgDoc = svgObject.contentDocument;
        if (svgDoc) {
            clearInterval(interval);
            callback(svgDoc);
        }
    }, 100);

    setTimeout(() => clearInterval(interval), 2000);
}

// Функция для очистки линий
export function clearPath() {
    // Получаем все object элементы для SVG этажей
    const svgObjects = document.querySelectorAll('object[data*="floor"]');

    svgObjects.forEach(svgObject => {
        const svgDoc = svgObject.contentDocument;

        if (!svgDoc) {
            console.warn('SVG документ отсутствует для:', svgObject);
            return;
        }

        const map = svgDoc.getElementById('map');
        const lines = svgDoc.querySelectorAll('.line');
        const boxes = map.querySelectorAll('.room-box');

        // Сбрасываем данные
        lines.forEach(line => line.remove());
        boxes.forEach(box_find => disactivateBox(box_find));

        try {
            const routeList = window.parent.document.getElementById('routeList');
            if (routeList) {
                routeList.innerHTML = '';
            }
        } catch (e) {
            console.error('Ошибка при очистке списка маршрутов:', e);
        }

        const routeGroup = window.parent.document.getElementById('routeGroup');
        if (routeGroup) {
            routeGroup.innerHTML = '';
        }
    });

    // Сбрасываем глобальные данные
    startPoint = null;
    startPointData = null;
    endPoint = null;
    endPointData = null;

    console.log('Маршрут успешно очищен на всех этажах');
}

// Дизактивация бокса
export function disactivateBox(box) {
	if (box) {
		box.classList.remove("room-box-activated")
	}
	orderOfSelectedBox = "0"
}

// Получаем все SVG объекты для этажей
const svgObjects = document.querySelectorAll('object[data*="floor"]');

svgObjects.forEach(svgObject => {
    waitForSVGLoad(svgObject, (svgDoc) => {
        console.log('Map loaded for:', svgObject);
        const map = svgDoc.getElementById('map');
        const boxes = svgDoc.querySelectorAll(".room-box");

        // Активация бокса
        function activateBox(box) {
            if (!isFloorVisible(svgObject)) return; // Проверяем видимость текущего SVG

            box.classList.add("room-box-activated");
            orderOfSelectedBox = box.dataset.order;
            //console.log(`Box activated: ${orderOfSelectedBox}`);
        }

        // Проверка видимости конкретного этажа
        function isFloorVisible(svgObject) {
            return svgObject.style.display !== "none" && svgObject.style.visibility !== "hidden";
        }

        // Сброс выделения боксов на всех SVG
        function resetAllBoxes() {
            svgObjects.forEach(otherSvgObject => {
                const otherSvgDoc = otherSvgObject.contentDocument;
                if (otherSvgDoc) {
                    const otherBoxes = otherSvgDoc.querySelectorAll(".room-box");
                    otherBoxes.forEach(disactivateBox);
                }
            });
        }

        // Обработка кликов по карте
        map.addEventListener('click', function (event) {
            if (!isFloorVisible(svgObject)) return; // Пропускаем скрытые этажи

            let isBlockClicked = false;

            boxes.forEach(box => {
                if (event.target === box) {
                    isBlockClicked = true;
                }
            });

            if (!isBlockClicked) {
                resetAllBoxes(); // Сбрасываем боксы, если кликнули не на них
            }
        });

        // Обработка кликов по боксу
        boxes.forEach(box => {
            box.addEventListener("click", function (event) {
                if (!isFloorVisible(svgObject)) return; // Пропускаем скрытые этажи

                if (orderOfSelectedBox !== box.dataset.order) {
                    resetAllBoxes(); // Сбрасываем другие выделения
                    activateBox(box); // Активируем текущий бокс
                }
            });
        });
    });
});
