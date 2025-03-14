var svgDOM = document.getElementsByTagName("svg")[0];
var textLabel = document.getElementById("WF");
var boxes = document.querySelectorAll(".room-interact");
var svgDOM = document.getElementsByTagName("svg")[0];
var orderOfSelectedBox = -1;
var scale = 1;
var isHolding = false;
//svgDOM.viewBox.baseVal.width = window.screen.availWidth;
//const WIDTH = svgDOM.viewBox.baseVal.width;
//svgDOM.viewBox.baseVal.height = window.screen.availHeight;
//const HEIGHT = svgDOM.viewBox.baseVal.height;
var _zoomScaleStep = 10;
var _zoomScaleSpeed = 0.004;

// Debug
svgDOM.onclick = function (e) {
	const domPoint = new DOMPointReadOnly(e.clientX, e.clientY);
    const pt = domPoint.matrixTransform(svgDOM.getScreenCTM().inverse());
    let X = (2 / 3) * (pt.x - 500);
    let Y = (2 / 3) * (pt.y - 500);

    
	textLabel.textContent = `(${X.toFixed(0)},${Y.toFixed(0)})`;
}

function activateBox(box) {
	box.classList.add("room-interact-activated");
	orderOfSelectedBox = box.dataset.order;
}

function disactivateBox(box) {
	box.classList.remove("room-interact-activated");
	orderOfSelectedBox = -1;
}

function zoom(e) {
	const ZOOM_MAX = 4;
	const ZOOM_MIN = 0.25;
	//e.preventDefault();
	scale += -event.deltaY * _zoomScaleSpeed;
	scale = Math.min(Math.max(ZOOM_MIN, scale), ZOOM_MAX);
	let viewBox = svgDOM.viewBox.baseVal;

	if ((ZOOM_MIN < scale) && (scale < ZOOM_MAX)) {
		svgDOM.style.transform = `scale(${scale})`;

		let newX = 2 * e.clientX/viewBox.width - 1, newY = 1 - 2 * e.clientY/viewBox.height;
		//console.log(`(${newX}, ${newY})`);
		//texxx.textContent = `(${newX},${newY}) scale=${scale}`;

		//viewBox.x += -Math.sign(event.deltaY) * newX * _zoomScaleStep;
		//viewBox.y -= -Math.sign(event.deltaY) * newY * _zoomScaleStep;
	}
}

	boxes.forEach(function(box) {
		box.addEventListener("click", (e) => {
			if (orderOfSelectedBox != box.dataset.order) {
				if (orderOfSelectedBox >= 0) {
					disactivateBox(boxes[orderOfSelectedBox]);
				}
				activateBox(box);
			}
		});
	});
