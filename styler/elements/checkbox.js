'use strict';

const qwery = require('qwery');

const {getOptions} = require('../options');
const {attributesToString, makeHtml, copyAttributes} = require('../transform');
const compileElement = require('../compileElement');


let toggleCheckbox = function (event, element, styledCheckbox) {

	if (element.disabled) {
		return;
	}

	switch (true) {
	case event.target === element:

		break;
	default:

		element.checked = !element.checked;

		let changeEvent = new CustomEvent('change');
		element.dispatchEvent(changeEvent);

		event.preventDefault();
		event.stopPropagation();

		break;
	}

	element.focus();
};

module.exports = function (element, styleOptions = {}) {


	styleOptions = getOptions(styleOptions);

	let elementTemplate = `<div class="custom-checkbox"><div class="custom-checkbox__div"></div></div>`;
	let styledCheckbox = compileElement(elementTemplate, element, styleOptions);

	if (element.disabled) {
		return false;
	}

	element.style.position = 'absolute';
	element.style.zIndex = '-1';
	element.style.opacity = 0;
	element.style.margin = 0;
	element.style.padding = 0;

	styledCheckbox.setAttribute('unselectable', 'on');
	styledCheckbox.style['-webkit-user-select'] = 'none';
	styledCheckbox.style['-moz-user-select'] = 'none';
	styledCheckbox.style['-ms-user-select'] = 'none';
	styledCheckbox.style['-o-user-select'] = 'none';
	styledCheckbox.style['user-select'] = 'none';
	styledCheckbox.style.display= 'inline-block';
	styledCheckbox.style.position= 'relative';
	styledCheckbox.style.overflow= 'hidden';

	if (element.checked) {
		styledCheckbox.classList.add('checked');
	}

	styledCheckbox.addEventListener('click', function (event) {
		toggleCheckbox(event, element, styledCheckbox);
		return false;
	});

	element.addEventListener('change', function () {
		styledCheckbox.classList.toggle('checked', element.checked);
	});

	element.addEventListener('focus', function () {
		if (!element.disabled) {
			styledCheckbox.classList.add('focused');
		}
	});

	element.addEventListener('blur', function () {
		styledCheckbox.classList.remove('focused');
	});
};
