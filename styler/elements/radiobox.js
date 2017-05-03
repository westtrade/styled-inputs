'use strict';

const {getOptions} = require('../options');
const {attributesToString, makeHtml, copyAttributes} = require('../transform');
const qwery = require('qwery');
const compileElement = require('../compileElement');


let toggleRadiobox = function (event, element, styledRadiobox) {

	if (element.disabled) {
		return;
	}

	switch (true) {
	case event.target === element:

		break;
	default:
		element.checked = !element.checked;
		let changeEvent = new Event('change');
		element.dispatchEvent(changeEvent);
		event.preventDefault();
		event.stopPropagation();
		break;
	}

	element.focus();
};

module.exports = function (element, styleOptions = {}) {

	styleOptions = getOptions(styleOptions);

	let elementTemplate = '<div class="custom-radio"><div class="custom-radio__div"></div></div>';
	let styledRadiobox = compileElement(elementTemplate, element, styleOptions);

	if (element.disabled) {
		return false;
	}

	element.style.position = 'absolute';
	element.style.zIndex = '-1';
	element.style.opacity = 0;
	element.style.margin = 0;
	element.style.padding = 0;

	styledRadiobox.setAttribute('unselectable', 'on');
	styledRadiobox.style['-webkit-user-select'] = 'none';
	styledRadiobox.style['-moz-user-select'] = 'none';
	styledRadiobox.style['-ms-user-select'] = 'none';
	styledRadiobox.style['-o-user-select'] = 'none';
	styledRadiobox.style['user-select'] = 'none';
	styledRadiobox.style.display= 'inline-block';
	styledRadiobox.style.position= 'relative';
	styledRadiobox.style.overflow= 'hidden';

	if (element.checked) {
		styledRadiobox.classList.add('checked');
	}

	styledRadiobox.addEventListener('click', function (event) {
		toggleRadiobox(event, element, styledRadiobox);
		return false;
	});

	element.addEventListener('change', function () {
		styledRadiobox.classList.toggle('checked', element.checked);
		let radioElements = element.form[element.name];
		let countOfElements = radioElements.length;
		while (countOfElements--) {
			let currentElement = radioElements[countOfElements];
			if (element === currentElement) {
				continue;
			}

			currentElement.parentNode.classList.remove('checked');
		}
	});

	element.addEventListener('focus', function () {
		if (!element.disabled) {
			styledRadiobox.classList.add('focused');
		}
	});

	element.addEventListener('blur', function () {
		styledRadiobox.classList.remove('focused');
	});
};
