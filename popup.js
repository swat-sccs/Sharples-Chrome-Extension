import manifest from './manifest.json' with { type: 'json' };

const tagHTML = (tag) => '<abbr class="tag ' + tag + '" title="' + capitalize(tag) + '">' + abbr(tag) + '</abbr>'

function abbr(tag) {
	switch (tag) {
		case ('vegetarian'):
			return 'vg';
		case ('glutenfree'):
			return 'gf';
		case ('sesame'):
			return 'ses';
		case ('shellfish'):
			return 'sf';
		case ('locallysourced'):
			return 'ls';
		case ('vegetarian'):
			return 'vg';
		case ('treenut'):
			return 'tn';
		default:
			return tag[0];
	}
}

var tagsIDs = ['vegan', 'vegetarian', 'halal',
	'glutenfree', 'alcohol', 'egg', 'fish', 'milk',
	'peanut', 'sesame', 'shellfish', 'soy', 'treenut',
	'wheat', 'locallysourced', 'organic', 'kosher'];


const capitalize = (word) => word[0].toUpperCase() + word.slice(1);



/**
 * Section below pertains to Theme (Dark/light mode)
 */

function getTheme() {
	return localStorage.getItem('dark');
}

function setTheme(setting) {
	localStorage.setItem('dark', setting);
}

function applyTheme(mode) {
	document.documentElement.dataset.appliedMode = mode;
}

// Handles dark mode and tag visibility toggles
function toggleTheme() {
	// updates based on stage
	getTheme() == 'light' ? setTheme('dark') : setTheme('light')
	applyTheme(getTheme());
}




/**
 * Section below pertains to Tags
 */


// refreshes page with tag preferences
function refreshTags() {
	// hide all tags first
	$('.tag').hide();

	// if the global tag visibility is allowed and the individual tag visibility is allowed, show it
	for (let tag of tagsIDs) {
		if (localStorage.getItem('tags') == 'true' && localStorage.getItem(tag) == 'true')  //if tags allowed
			$('.' + tag).show();
	}
}

// create the switch with a given name
function createSwitches() {
	for (let id of tagsIDs) {
		const temp = document.getElementById("switchTemplate");
		let root = temp.content.querySelector("tr");
		let a = document.importNode(root, true);

		let label = a.querySelector("label");
		label.setAttribute('id', id);

		let title = a.querySelector("#switchTitle");
		title.textContent = capitalize(id)

		let input = a.querySelector("input");
		input.checked = localStorage.getItem(id) == 'true';

		tagTable.appendChild(a);

		document.getElementById(id).addEventListener('change', () => { watchSwitch(id) })
	}
	return
}

// toggles visibility of all tags
function toggleTags() {
	(localStorage.getItem('tags') == 'false') ? localStorage.setItem('tags', 'true') :
		localStorage.setItem('tags', 'false');
	refreshTags();
}


// toggle switch state in local storage and refresh tags
function watchSwitch(name) {
	localStorage.getItem(name) == 'true' ? localStorage.setItem(name, 'false') :
		localStorage.setItem(name, 'true')
	refreshTags();
}





/**
 * Section below pertains to Page/Data handling
 */

async function getMenus() {
	const response = await fetch('http://dining.sccs.swarthmore.edu/api')
		.catch(error => console.error('Error:', error));
	const data = await response.json();
	localStorage.setItem('data', JSON.stringify(data));
	return data;
}

// set the active tab's css style
function setActiveTab(activeTabID) {
	for (let tab of $('.tab')) { tab.style = '' }
	document.getElementById(activeTabID).style['backgroundColor'] = 'hsl(216, 33%, 25%)';
	refreshTags();
};

// unpuns the menu names
function unpun(title) {
	return title
		.replace('Classics', 'Menu 1')
		.replace('World of Flavor', 'Menu 2')
		.replace('Spice', 'Menu 3')
		.replace('Verdant & Vegan', 'Vegan')
		.replace('Free Zone', 'Allergen Choice')
		.replace('Daily Kneads', 'Dessert')
		.replace('Field of Greens', 'Salad')
		.replace('Meal', 'Meal Plan Selection')
		.replace('Special', 'Lunch Special')
		.replace('Soup', 'Daily Soup')
};

function setTabOnClicks(obj) {
	const tabs = [
		'breakfast',
		'lunch',
		'dinner',
		'essies',
		'kohlberg',
	]
	$('body').on('click', '#breakfastTab', function () {
		setMenu(obj['Dining Center'], 'breakfast');
		setActiveTab('breakfastTab');
	});
	$('body').on('click', '#lunchTab', function () {
		setMenu(obj['Dining Center'], 'lunch')
		setActiveTab('lunchTab');
	});
	$('body').on('click', '#dinnerTab', function () {
		setMenu(obj['Dining Center'], 'dinner');
		setActiveTab('dinnerTab');
	});
	$('body').on('click', '#essiesTab', function () {
		setMenu(obj.Essies);
		setActiveTab('essiesTab');
	});
	$('body').on('click', '#kohlbergTab', function () {
		setMenu(obj.Kohlberg);
		setActiveTab('kohlbergTab');
	});
}

// turns objectified menu into a parsed string, returned string
function formatMenu(items, delim) {
	var newLst = [];
	if (typeof (items) == 'string') {
		return [items];
	}

	for (let item of items) {
		var string = item.item;
		if (item.properties != null) {
			for (let prop of item.properties) {
				if (tagsIDs.includes(prop)) {
					string += tagHTML(prop);
				}
			};
		};
		newLst.push(string);
	};

	return newLst.join(delim);
};

function generateMenuElement(subtree) {
	var errors = [];
	const inclusions = [
		'Classics',
		'World of Flavor',
		'Spice',
		'Verdant & Vegan',
		'Free Zone',
		'Field of Greens',
		'Daily Kneads',
		'soup',
		'lunch',
		'special',
		'menu',
		'meal'
	];
	// for each menu in the venue
	for (let station of inclusions) {
		// if the menu exists
		if (!subtree[station]) {
			errors.push(station);
			continue
		}

		// create, capitalize, unpun, and append menu title to div
		const titleElement = document.createElement('h2');
		const titleText = capitalize(station);
		titleElement.textContent = unpun(titleText);
		menu.appendChild(titleElement);

		// create, format, and append menu content to div
		const menuElement = document.createElement('p');
		const menuText = formatMenu(subtree[station], ', ');
		menuElement.innerHTML = menuText;
		menu.appendChild(menuElement);
	};
	// console.log('Menus not found: ' + errors.join(', '));
};

function displayClosedVenue(msg) {
	console.log('Selected menu contains no data.');
	menuTitle.textContent = msg ? msg : 'Venue is closed.';
}

function setMenu(subtree, meal = null) {

	// clear menu board first
	while (menu.firstChild) menu.removeChild(menu.firstChild);


	if (!subtree.open) {
		console.log('venue not open');
		displayClosedVenue(subtree.desc ? subtree.desc : null);
		return 1;
	};

	subtree = meal ? subtree.meals[meal] : subtree

	// set the menu time
	menuTitle.textContent = 'Hours: ' + subtree.time;

	// if given data is null or empty, display a closed message
	// and terminate function
	if (meal) {
		if (!subtree) {
			console.log('Undefined subtree');
			displayClosedVenue(null);
			return 1;
		};
	} else {
		if (!subtree.meals) {
			console.log('subtree empty');
			displayClosedVenue(null);
			return 1;
		};
	}

	generateMenuElement(subtree);

	return 0;
};

// Construct the page
function constructPage(obj) {
	setTabOnClicks(obj);

	// set title and date
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	title.textContent = 'Narples - ' + months[new Date().getMonth()] + ' ' + new Date().getDate();

	const subtree = obj['Dining Center'];
	let hour = new Date().getHours()
	if (hour < 10) {
		setMenu(subtree, 'breakfast');
		setActiveTab('breakfastTab');
	} else if (hour < 14) {
		setMenu(subtree, 'lunch');
		setActiveTab('lunchTab');
	} else if (hour < 21) {
		setMenu(subtree, 'dinner');
		setActiveTab('dinnerTab');
	} else {
		setMenu(obj.Essies);
		setActiveTab('essiesTab');
	};

};

// Set user preferences
function setPrefs() {

	// set the toggle state for tag vis and dark/light modes
	mfer.checked = localStorage.getItem('dark') == 'dark'
	mfer2.checked = localStorage.getItem('tags') == 'true';

	// apply the dark/light theme
	applyTheme(getTheme());

	// set version number in preferences menu
	version.textContent = 'Running on v' + manifest.version;
};






/**
 * Section below pertains to Event Handlers
 */

// Handles links
$('body').on('click', 'a', function () {
	chrome.tabs.create({ url: $(this).attr('href') });
	return false;
});

// preferences menu/brandy info event handlers
$('body').on('click', '#gear', function () {
	$('#prefMenu').css('display', 'flex');
});

$('body').on('click', '#button', function () {
	$('#brandyInfo').css('display', 'flex');
});

$('body').on('click', '.closebtn', function () {
	$('#prefMenu').hide();
	$('#brandyInfo').hide();
});

window.onclick = function (event) {
	if (event.target == prefMenu || event.target == brandyInfo) {
		$('#prefMenu').hide();
		$('#brandyInfo').hide();
	}
}

// runs the command (darkMode) when the dark mode toggle switch is changed
darkSwitch.addEventListener('change', toggleTheme);

// runs the command (toggleTags) when the main tag toggle switch is changed
mfer2.addEventListener('change', toggleTags);








/**
 * Section below pertains to Main function flow
 */

// set theme and other preferences so users dont get flashbanged
setPrefs();

// populate tag switch menu and start event watchers 
createSwitches();


let cachedObj = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : await getMenus();

console.log(cachedObj)

constructPage(cachedObj);

// let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 5, 0, 0);

// if (Date.parse(new Date()) > Date.parse(tomorrow) || cachedObj.hash != await getMenus().hash) {

await getMenus().then(data => {
	if (cachedObj.hash != data.hash) {
		console.log('Hash changed, fetching data.')
		cachedObj = data;
	}
})



