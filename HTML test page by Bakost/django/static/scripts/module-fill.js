import { sendpost } from "./sendpost.js"
import { sharedData } from './carousel.js'
import { clearPath, disactivateBox } from '/map/static/svg/scripts/map.js'

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed in module-fill!')

    function applyRoute() {
        const from_route = document.getElementById('from').value
        const to_route = document.getElementById('to').value

        const audience = ["415", "416", "418", "419", "421", "422", "423", "424", "425", "426", "427", "428", "429", "430", "431", "432", "433", "434", "511", "512", "513", "515", "516", "518a", "K", "WC1", "WC2"];
    
        // Проверка, что введённые значения являются допустимыми номерами аудиторий
        if (!audience.includes(from_route) || !audience.includes(to_route)) {
            alert("Пожалуйста, введите правильно номер аудитории или номер пункта!");
            return;
        }
        
        /*
        const numberPattern = /^[0-9]+$/

        if (!numberPattern.test(from_route) || !numberPattern.test(to_route)) {
            alert("Пожалуйста, введите целые числа в оба поля.")
        } else {
            sharedData.startPointData = parseInt(from_route)
            sharedData.endPointData = parseInt(to_route)
            sendpost()
        }
        */

        sharedData.startPointData = from_route
        sharedData.endPointData = to_route
        sendpost()
    }

    document.querySelector('.apply-button').addEventListener('click', () => {
        clearPath()
        applyRoute()
    })

    document.querySelector('.clear-path-button').addEventListener('click', () => {
        clearPath()
    })

    const menuButton = document.getElementById('menu-button');
    const moduleFill = document.getElementById('module-fill');
    
    const buttonRect = menuButton.getBoundingClientRect();
    
    const offsetTop = window.scrollY;
    const offsetLeft = window.scrollX;
    
    const moduleTop = buttonRect.top + offsetTop;
    const moduleLeft = buttonRect.right + offsetLeft + 10;
    
    moduleFill.style.top = `${moduleTop}px`;
    moduleFill.style.left = `${moduleLeft}px`;
    
    menuButton.addEventListener('click', () => {
        const svgObject = document.getElementById('svg-object');
        const svgDoc = svgObject.contentDocument;
        const map = svgDoc.getElementById('map');
        var boxes = map.querySelectorAll(".room-box");
    
        boxes.forEach(box => {
            disactivateBox(box);
        });
    
        toggleMenu();
    });
    
    // Функция открытия/закрытия меню
    function toggleMenu() {
        if (moduleFill.classList.contains('hidden')) {
            moduleFill.classList.remove('hidden');
            moduleFill.classList.add('visible');
        } else {
            moduleFill.classList.remove('visible');
            moduleFill.classList.add('hidden');
        }
    }
    
    // Добавление обработчика нажатия клавиш
    document.addEventListener('keydown', (event) => {
        if (moduleFill.classList.contains('visible')) {
            if (event.key === 'Escape') {
                // Закрытие меню
                if (moduleFill.classList.contains('visible')) {
                    moduleFill.classList.remove('visible');
                    moduleFill.classList.add('hidden');
                }
            } else if (event.key === 'Enter') {
                // Анимация для кнопки
                const applyButton = document.querySelector('.apply-button');
                applyButton.classList.add('pressed');

                // Удаление класса через 200 мс
                setTimeout(() => {
                    applyButton.classList.remove('pressed');
                }, 200);

                // Применение маршрута
                clearPath();
                applyRoute();
            }
        } else if (event.key === 'Enter') {
            if (moduleFill.classList.contains('hidden')) {
                moduleFill.classList.remove('hidden');
                moduleFill.classList.add('visible');
            }
        }
    })
})
