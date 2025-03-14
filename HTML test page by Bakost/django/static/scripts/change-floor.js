document.addEventListener("DOMContentLoaded", () => {
    const floor4 = document.getElementById("floor4");
    const floor5 = document.getElementById("floor5");
    const buttonFloor4 = document.getElementById("switch-to-floor4");
    const buttonFloor5 = document.getElementById("switch-to-floor5");

    let activeFloor = "floor4"; // Текущий активный этаж

    // Функция для переключения этажей
    const switchFloor = (floorToShow) => {
        const floorToHide = activeFloor === "floor4" ? floor4 : floor5;
        const floorToActivate = floorToShow === "floor4" ? floor4 : floor5;

        // Убираем старый этаж
        floorToHide.classList.remove("active");
        //disableFloorScripts(floorToHide);

        // Показываем новый этаж
        floorToActivate.classList.add("active");
        //enableFloorScripts(floorToActivate);

        activeFloor = floorToShow; // Обновляем текущий активный этаж
    };

    // Отключение скриптов для невидимого этажа
    const disableFloorScripts = (floor) => {
        const svgObject = floor.querySelector("object");
        if (svgObject) {
            const svgDocument = svgObject.contentDocument;
            if (svgDocument) {
                // Пример отключения событий (например, для зума)
                svgDocument.removeEventListener("mousedown", handleZoom);
                svgDocument.removeEventListener("mousemove", handleZoom);
            }
        }
    };

    // Включение скриптов для видимого этажа
    const enableFloorScripts = (floor) => {
        const svgObject = floor.querySelector("object");
        if (svgObject) {
            const svgDocument = svgObject.contentDocument;
            if (svgDocument) {
                // Пример добавления событий (например, для зума)
                svgDocument.addEventListener("mousedown", handleZoom);
                svgDocument.addEventListener("mousemove", handleZoom);
            }
        }
    };

    // Привязка событий к кнопкам
    buttonFloor4.addEventListener("click", () => switchFloor("floor4"));
    buttonFloor5.addEventListener("click", () => switchFloor("floor5"));
});
