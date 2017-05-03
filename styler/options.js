'use strict';


let defaultOptions = {
	idSuffix: '-styler',
	singleSelectzIndex: 100,
	file: {
		placeholder: 'Файл не выбран',
		browseLabel: 'Обзор...',
		numberLabel: 'Выбрано файлов %s',
	},
	search : {
		enable: false,
		limit: 10,
		notFound: 'Совпадений не найдено',
		placeholder: 'Поиск...',
	},
	zIndex: 100,
	smartPositioning: true,
};

let getOptions = currentOptions => Object.assign({}, defaultOptions, currentOptions);

let optionNameConverter = optionName => optionName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

let getSearchOptions = (currentOptions, element) => {
	currentOptions = Object.assign({}, defaultOptions, currentOptions);
	let searchOptions = Object.assign({},
		defaultOptions.search,
		currentOptions.search,
		{zIndex: currentOptions.zIndex, smartPositioning: currentOptions.smartPositioning}
	);

	let searchOptionKeys = Object.keys(searchOptions);
	let keysCount = searchOptionKeys.length;
	let passPrefixForNames = ['zIndex', 'smartPositioning'];

	if (element.hasAttribute('search')) {
		let searchEnabled = element.getAttribute('search');
		searchEnabled = searchEnabled === '' || searchEnabled;
		searchOptions.enable = searchEnabled;
	}

	while (keysCount--) {
		let optionName = searchOptionKeys[keysCount];

		let prefix = passPrefixForNames.indexOf(optionName) < 0 ? 'search-' : '';
		let optionDataName = prefix + optionNameConverter(optionName);
		let value = element.getAttribute(optionDataName) || element.getAttribute('data-' + optionDataName);
		if (value) {
			searchOptions[optionName] = value;
		}
	}

	return searchOptions;
};

module.exports = {defaultOptions, getOptions, getSearchOptions};
