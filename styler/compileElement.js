'use strict';

const angular = require('angular');

const {attributesToString, makeHtml, copyAttributes} = require('./transform');

module.exports = (elementTemplate, element, styleOptions = {}) => {
	let styledElement;
	
	styledElement = makeHtml(elementTemplate);
	copyAttributes(element, styledElement, styleOptions);

	styledElement.isCustom = true;
	if (element.parentNode.isCustom) {
		element.parentNode.parentNode.replaceChild(styledElement, element.parentNode);
		styledElement.insertBefore(element, styledElement.firstChild);

	} else {
		element.parentNode.insertBefore(styledElement, element.nextSibling);
		styledElement.insertBefore(element, styledElement.firstChild);
	}

	if (element.disabled) {
		styledElement.classList.add('disabled');
	}

	return styledElement;
};
