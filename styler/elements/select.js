'use strict';

const qwery = require('qwery');

const {getOptions, getSearchOptions} = require('../options');
const {attributesToString, makeHtml, copyAttributes} = require('../transform');
const compileElement = require('../compileElement');

let isiOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/i) && !navigator.userAgent.match(/(Windows\sPhone)/i)) ? true : false;
let isAndroid = (navigator.userAgent.match(/Android/i) && !navigator.userAgent.match(/(Windows\sPhone)/i)) ? true : false;

let disableScrollingListener = function (event) {

	let scrollTo = null;
	switch (true) {
	case event.type == 'mousewheel':
		scrollTo = (event.wheelDelta * -1);
		break;
	case event.type == 'DOMMouseScroll':
		scrollTo = 40 * event.detail;
		break;
	}

	if (scrollTo) {
		event.stopPropagation();
		event.preventDefault();
		this.scrollTop = scrollTo + this.scrollTop;
	}
};


let preventScrolling = elements => {
	let elementsCount = elements.length;
	while (elementsCount--) {
		let element = elements[elementsCount];
		element.removeEventListener('mousewheel', disableScrollingListener);
		element.removeEventListener('DOMMouseScroll', disableScrollingListener);
		element.addEventListener('mousewheel', disableScrollingListener);
		element.addEventListener('DOMMouseScroll', disableScrollingListener);
	}
};


let generateOptionsList = (element, styleOptions) => {
	//element.options
	let stringOptionsList = [];

	const options = element.options;

	for (let i = 0; i < options.length; i++) {

		let currentOption = options[i];

		let classList = '';
		if (options.selectedIndex === i) {
			classList = classList + ' selected sel';
		}

		if (currentOption.disabled) {
			classList = classList + ' disabled';
		}

		let overridedAttributes = {class: classList};
		if (currentOption.className && currentOption.className.length) {
			overridedAttributes['data-jqfs-class'] = currentOption.className;
		}

		if (currentOption.parentNode.tagName.toLowerCase() === 'optgroup') {
			overridedAttributes['class'] += ' option';

			let optGroupClasses = currentOption.parentNode.className && currentOption.parentNode.className.length
				? currentOption.parentNode.className
				: '';

			if (optGroupClasses.length) {
				overridedAttributes['class'] += ' ' + optGroupClasses;
			}

			if (currentOption.parentNode.firstChild === currentOption) {
				stringOptionsList.push(`<li class="optgroup ${optGroupClasses}">${ currentOption.parentNode.getAttribute('label') }</li>`);
			}
		}

		// if (i === 0 && currentOption.innerHTML.trim() === '' && !currentOption.parentNode.hasAttribute('placeholder')) {
		// 	overridedAttributes['style'] = 'display: none;';
		// }

		let optionAttrs = attributesToString(currentOption, overridedAttributes, styleOptions);
		stringOptionsList.push(`<li ${ optionAttrs.trim() }>${ currentOption.innerHTML }</li>`);
	}

	return stringOptionsList;
};

document.addEventListener('click', function (event) {
	let openedItems = qwery('.custom-selectbox.opened');
	let openedCount = openedItems.length;

	while (openedCount--) {
		let item = openedItems[openedCount];
		item.classList.remove('opened');
		let [dropdownMenu] = qwery('.custom-selectbox__dropdown', item);
		// dropdownMenu.style.display = 'none';
	}
});



const parseRepeatItems = /[<][!]-- ngRepeat:([^-]+) --[>]/gim;


const hideElement = (element) => {
	element.style.margin = 0;
	element.style.padding = 0;
	element.style.position = 'absolute';
	element.style.left = 0;
	element.style.top = 0;
	element.style.width = '100%';
	element.style.height = '100%';
	element.style.opacity = 0;
};

const render = (element, styleOptions) => {

	// let optionsList = qwery('option', element) || []

	let stringOptionsList = generateOptionsList(element, styleOptions);
	let placeholder = element.getAttribute('placeholder');

	let searchOptions = getSearchOptions(styleOptions, element);
	let searchTemplate = searchOptions.enable
		? `
			<div ${stringOptionsList.length ? '' : 'style="display: none;"'} class="custom-selectbox__search">
				<input type="search" autocomplete="off" placeholder="${ searchOptions.placeholder }">
			</div>
			<div style="display: none;" class="custom-selectbox__not-found">${ searchOptions.notFound }</div>
		`
		: '';

	const selectedElement = element.options[element.selectedIndex];

	let placeholderText = selectedElement ? selectedElement.innerHTML.trim() : '';
	placeholderText = placeholderText === '' ? placeholder : placeholderText;

	let template = `
		<div class="custom-selectbox jqselect">
			<div class="custom-selectbox__select">
				<div class="custom-selectbox__select-text ${ element.selectedIndex < 0 ? 'placeholder' : '' }">
					${ placeholderText || '' }
				</div>
				<div class="custom-selectbox__trigger">
					<div class="custom-selectbox__trigger-arrow"></div>
				</div>
				<div class="custom-selectbox__dropdown">
					${ searchTemplate }
					<ul>${ stringOptionsList.join('') }</ul>
				</div>
			</div>
		</div>
	`;

	let styledElement = compileElement(template, element, styleOptions);

	styledElement.style.display = 'inline-block';
	styledElement.style.position = 'relative';
	// styledElement.style.zIndex = styleOptions.singleSelectzIndex;

	hideElement(element);

	if (element.disabled) {
		return false;
	}

	let [dropdownToggler] = qwery('.custom-selectbox__select', styledElement);
	let [dropdownMenu] = qwery('.custom-selectbox__dropdown', styledElement);
	let [selectPlaceholder] = qwery('.custom-selectbox__select-text', styledElement);


	const customEventsData =  {
		detail: {
			preventRender: true
		},
		// 	bubbles: true,
		// 	cancelable: true
	};

	dropdownToggler.addEventListener('click', function (event) {

		const anotherSelectos = qwery('.custom-selectbox.opened');

		anotherSelectos.filter(item => item !== styledElement).forEach(item =>  {
			item.classList.remove('opened')
		});

		if (styledElement.className.indexOf('opened') >= 0) {
			let event = new CustomEvent('close', customEventsData);
			element.dispatchEvent(event);
		};

		element.focus();

		if (isiOS) {
			return ;
		}

		let isValidSelector = event.target.hasAttribute('value')
			&& event.target.className.indexOf('disabled') < 0
			&& event.target.className.indexOf('optgroup') < 0
		;

		if (isValidSelector) {
			element.value = event.target.getAttribute('value');

			let changeEvent = new CustomEvent('change', customEventsData);
			element.dispatchEvent(changeEvent);

			selectPlaceholder.innerHTML = event.target.innerHTML;
			selectPlaceholder.classList.toggle('placeholder', element.selectedIndex < 0);
		}

		styledElement.classList.toggle('opened');

		event.preventDefault();
		event.stopPropagation();
	});
};

let makeSelect = function (element, styleOptions = {}) {

	element.addEventListener('change', (event) => {
		const { preventRender } = event.detail || {};
		if (!preventRender) {
			render(element, styleOptions);
		}
	});

	render(element, styleOptions);
	setTimeout(() => {
		const [selectedOptions] = qwery('option[selected]', element);
		if (!selectedOptions) {
			element.selectedIndex = -1;
		}

		//element.selectedOptions
		// element.selectedIndex = element.options.selectedIndex ;
		render(element, styleOptions)
	}, 0);
};

module.exports = function (element, styleOptions = {}) {
	styleOptions = getOptions(styleOptions);
	makeSelect(element, styleOptions);
};
