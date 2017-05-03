'use strict';

const styler = require('./styler');

module.exports = () => () => {
	return {
		priority: 15,
		restrict: 'AEM',
		// require: 'ngModel',
		link: (scope, element, attrs) => {
			if ('item' in scope && scope.item.selected) {
				element.attr('checked', true); //TODO Remove hack, not work for ngModel
			}

			styler(element);
		}
	}
};
