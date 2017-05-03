'use strict';

const styler = require('./styler');

module.exports = () => () => {
	return {
		priority: 15,
		restrict: 'AEM',
		// require: 'ngModel',
		link: (scope, element, attrs) => {
			styler(element);
		}
	}
};
