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
	const root = switchTemplate.content.querySelector("tr");

	for (let id of tagsIDs) {
		let a = document.importNode(root, true);

		a.querySelector("label").setAttribute('id', id);
		a.querySelector("#switchTitle").textContent = capitalize(id);
		a.querySelector("input").checked = localStorage.getItem(id) == 'true';

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

// unpuns the menu names
function unpun(title) {
	const punDict = {
		'Classics': 'Menu 1',
		'World of Flavor': 'Menu 2',
		'Spice': 'Menu 3',
		'Verdant & Vegan': 'Vegan',
		'Free Zone': 'Allergen Choice',
		'Daily Kneads': 'Dessert',
		'Field of Greens': 'Salad',
		'Meal': 'Meal Plan Selection',
		'Special': 'Lunch Special',
		'Soup': 'Daily Soup',
	}
	return punDict[title]
};

function setTabOnClicks(obj) {
	const tabs = [
		[obj['Dining Center'], 'breakfast'],
		[obj['Dining Center'], 'lunch'],
		[obj['Dining Center'], 'dinner'],
		[obj.Essies, 'essies'],
		[obj.Kohlberg, 'kohlberg']
	]
	for (let item of tabs) {
		$('body').on('click', `#${item[1]}Tab`, function () {
			setMenu(item[0], item[1]);
		});
	}
}

// turns objectified menu into a parsed string, returned string
function formatMenu(items, delim) {
	var ret = [];
	if (typeof (items) == 'string') return [items];

	for (let item of items) {
		var string = item.item;
		if (!item.properties) continue;
		item.properties.forEach(prop => {
			if (tagsIDs.includes(prop)) string += tagHTML(prop);
		});
		ret.push(string);
	};

	return ret.join(delim);
};

function generateMenuElement(subtree) {
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
	// for each station in the meal subtree
	for (let station of inclusions) {
		// if the station doesnt exist, skip it 
		if (!subtree[station]) continue;

		// create, capitalize, unpun, and append menu title to div
		const titleElement = document.createElement('h2');
		titleElement.textContent = unpun(capitalize(station));
		menu.appendChild(titleElement);

		// create, format, and append menu content to div
		const menuElement = document.createElement('p');
		menuElement.innerHTML = formatMenu(subtree[station], ', ');
		menu.appendChild(menuElement);
	};
};

const displayClosedVenue = function (msg) { menuTitle.textContent = msg ? msg : 'Venue is closed.' };

const clearChildren = function (test) { while (test.firstChild) test.removeChild(test.firstChild) };

function setMenu(subtree, venue) {

	// clear menu board first
	clearChildren(menu);

	// check if subtree exists
	if (!subtree) {
		console.log('Undefined subtree');
		displayClosedVenue(subtree.desc);
		return 1;
	};

	// check if venue is open
	if (!subtree.open) {
		console.log('Venue not open');
		displayClosedVenue(subtree.desc);
		return 1;
	};

	// check if meals is not empty
	if (!subtree.meals) {
		console.log('Subtree meals empty');
		displayClosedVenue(subtree.desc);
		return 1;
	};

	// check if subtree is in dining center or not
	subtree = ['breakfast', 'lunch', 'dinner'].includes(venue) ? subtree.meals[venue] : subtree

	// set the menu time
	menuTitle.textContent = 'Hours: ' + subtree.time;

	// generate the menu
	generateMenuElement(subtree);

	// set active tab and refresh tabs
	for (let tab of $('.tab')) { tab.style = '' }
	document.getElementById(`${venue}Tab`).style['backgroundColor'] = 'hsl(216, 33%, 25%)';
	refreshTags();

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
	} else if (hour < 14) {
		setMenu(subtree, 'lunch');
	} else if (hour < 21) {
		setMenu(subtree, 'dinner');
	} else {
		setMenu(obj.Essies, 'essies');
	};

};

// Set user preferences
function setPrefs() {

	// set the toggle state for tag vis and dark/light modes
	darkSwitch.checked = localStorage.getItem('dark') == 'dark'
	tagToggle.checked = localStorage.getItem('tags') == 'true';

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

// runs the command (toggleTags) when the main tag toggle switch is changed
tagToggle.addEventListener('change', toggleTags);

// runs the command (darkMode) when the dark mode toggle switch is changed
darkSwitch.addEventListener('change', toggleTheme);









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

await getMenus().then(data => {
	if (cachedObj.hash != data.hash) {
		console.log('Hash changed, fetching data.')
		cachedObj = data;
	}
})



