'use strict';

const {getOptions} = require('./options');
const elements = require('./elements');

module.exports = (styledElementsList, styleOptions = {}) => {
	
	styleOptions = getOptions(styleOptions);
	let styledCount = styledElementsList.length;

	while(styledCount--) {

		let element = styledElementsList[styledCount];
		let isInput = element.tagName.toLowerCase() === 'input';

		switch (true) {
		case isInput && element.getAttribute('type') === 'checkbox':
			elements.checkbox(element, styleOptions);
			break;
		case isInput && element.getAttribute('type') === 'radio':
			elements.radiobox(element, styleOptions);
			break;

		case element.tagName.toLowerCase() === 'select':
			elements.select(element, styleOptions);
			break;

		default:

		}
	}
};

module.exports.elements = elements;
