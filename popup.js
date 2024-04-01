import manifest from './manifest.json' with { type: 'json' };

const tagHTML = (tag) => '<abbr class="tag ' + tag + '" title="' + capitalize(tag) + '">' + abbr(tag) + '</abbr>'

function abbr(tag) {
	switch (tag) {
		case ("vegetarian"):
			return "vg";
		case ("glutenfree"):
			return "gf";
		case ("sesame"):
			return "ses";
		case ("shellfish"):
			return "sf";
		case ("locallysourced"):
			return "ls";
		case ("vegetarian"):
			return "vg";
		case ("treenut"):
			return "tn";
		default:
			return tag[0];
	}
}

var tagsIDs = ["vegan", "vegetarian", "halal",
	"glutenfree", "alcohol", "egg", "fish", "milk",
	"peanut", "sesame", "shellfish", "soy", "treenut",
	"wheat", "locallysourced", "organic", "kosher"];


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
	getTheme() == "light" ? setTheme("dark") : setTheme("light")
	applyTheme(getTheme());
}




/**
 * Section below pertains to Tags
 */

// toggles visibility of all tags
function toggleTags() {
	(localStorage.getItem("tags") == "false") ? localStorage.setItem("tags", "true") :
		localStorage.setItem("tags", "false");
	refreshTags();
}

// refreshes page with tag preferences
function refreshTags() {
	// hide all tags first
	// if the global tag visibility is allowed, check for individual tag visibility
	// if the individual tag visibility is allowed, show it
	for (let tag of tagsIDs) {
		$("." + tag).hide();
		if (localStorage.getItem("tags") == "true")  //if tags allowed
			if (localStorage.getItem(tag) == "true")
				$("." + tag).show();
	}
}

// create the switch with a given name
function createSwitch(name) {

	// <label class="tagswitch" id="vegan">
	// 	<input type="checkbox">
	// 	<span class="slider round"></span>
	// </label>

	let row = document.createElement("tr")
	let titleElement = document.createElement("td")
	let switchElement = document.createElement("td")

	titleElement.textContent = capitalize(name)

	row.appendChild(titleElement)
	row.appendChild(switchElement)

	let switchLabel = document.createElement("label")
	switchLabel.setAttribute("class", "tagswitch")
	switchLabel.setAttribute("id", name)

	switchElement.appendChild(switchLabel)

	let switchInput = document.createElement("input")
	switchInput.setAttribute("type", "checkbox")
	switchInput.checked = localStorage.getItem(name) == "true";

	switchLabel.appendChild(switchInput)

	let switchSpan = document.createElement("span")
	switchSpan.setAttribute("class", "slider round")
	switchLabel.appendChild(switchSpan)

	document.getElementById("tagTable").appendChild(row)
}

// function that runs for a switch when it is toggled
function watchSwitch(name) {
	(localStorage.getItem(name) == "true") ? localStorage.setItem(name, "false") :
		localStorage.setItem(name, "true")
	refreshTags();
}





/**
 * Section below pertains to Page/Data handling
 */

async function getMenus() {
	const response = await fetch('http://dining.sccs.swarthmore.edu/api')
		.catch(error => console.error('Error:', error));
	const data = await response.json();
	return data;
}

// set the active tab's css style
function setActiveTab(activeTabID) {
	for (let tab of $('.tab')) { tab.style = "" }
	document.getElementById(activeTabID).style["backgroundColor"] = "hsl(216, 33%, 25%)";
	refreshTags();
};

// unpuns the menu names
function unpun(title) {
	return title
		.replace("Classics", "Menu 1")
		.replace("World of Flavor", "Menu 2")
		.replace("Spice", "Menu 3")
		.replace("Verdant & Vegan", "Vegan")
		.replace("Free Zone", "Allergen Choice")
		.replace("Daily Kneads", "Dessert")
		.replace("Field of Greens", "Salad")
		.replace("Meal", "Meal Plan Selection")
		.replace("Special", "Lunch Special")
		.replace("Soup", "Daily Soup")
};

function setTabOnClicks(obj) {
	$('body').on('click', '#breakfastTab', function () {
		setMenu(obj['Dining Center'].breakfast, "Dining Center");
		setActiveTab("breakfastTab");
	});
	$('body').on('click', '#lunchTab', function () {
		if (setMenu(obj['Dining Center'].lunch, "Dining Center")) {
			setMenu(obj['Dining Center'].brunch, "Dining Center")
		};
		setActiveTab("lunchTab");
	});
	$('body').on('click', '#dinnerTab', function () {
		setMenu(obj['Dining Center'].dinner, "Dining Center");
		setActiveTab("dinnerTab");
	});
	$('body').on('click', '#EssiesTab', function () {
		setMenu(obj.Essies, "Essies");
		setActiveTab("EssiesTab");
	});
	$('body').on('click', '#KohlbergTab', function () {
		setMenu(obj.Kohlberg, "Kohlberg");
		setActiveTab("KohlbergTab");
	});
	$('body').on('click', '#CrumbTab', function () {
		setMenu(obj.Crumb, "Crumb");
		setActiveTab("CrumbTab");
	});
}

// turns objectified menu into a parsed string, returned string
function formatMenu(items, delim) {
	var newLst = [];
	if (typeof (items) == "string") {
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

function generateMenuElement(subtree, inclusions, delimiter) {
	var errors = [];
	// for each menu in the venue
	for (let menu of inclusions) {
		// if the menu exists
		if (subtree[menu]) {
			// create, capitalize, unpun, and append menu title to div
			const titleElement = document.createElement('h2');
			const titleText = capitalize(menu);
			titleElement.textContent = unpun(titleText);
			document.getElementById("menu").appendChild(titleElement);

			// create, format, and append menu content to div
			const menuElement = document.createElement('p');
			const menuText = formatMenu(subtree[menu], delimiter);
			menuElement.innerHTML = menuText;
			document.getElementById("menu").appendChild(menuElement);
		} else {
			// for all other menus that weren't found, push to array to log
			errors.push(menu);
		};
	};
	// console.log("Menus not found: " + errors.join(", "));
}

function setMenu(subtree, venue) {

	// clear menu board first
	const board = document.getElementById("menu");
	while (board.firstChild) {
		board.removeChild(board.firstChild);
	};

	// if given data is null or empty, display a closed message
	// and terminate function
	if (!subtree || Object.keys(subtree).length === 0) {
		console.log("Selected menu contains no data.");
		const close = document.createElement("h2");
		const bar = document.createElement("hr");
		close.textContent = (venue == "Kohlberg") ?
			"Venue (aka Kohlberg) is closed" : "Venue is closed";

		document.getElementById("menu").appendChild(close);
		document.getElementById("menu").appendChild(bar);
		return 1;
	};

	// temporarily set list of Tags that we want to display
	// and discretely define what sections are allowed
	const inclusions = [
		"Classics",
		"World of Flavor",
		"Spice",
		"Verdant & Vegan",
		"Free Zone",
		"Field of Greens",
		"Daily Kneads",
		"soup",
		"lunch",
		"special",
		"menu",
		"meal"
	];

	// set the menu time
	const timeElement = document.createElement('h2');
	const timeText = subtree.time

	// if it's kohlberg, then add note about Brandy's Bar
	timeElement.textContent = (venue == "Kohlberg") ?
		"Hours: " + timeText + "  (aka Kohlberg)" : "Hours: " + timeText;

	document.getElementById("menu").appendChild(timeElement);

	const bar = document.createElement('hr');
	document.getElementById("menu").appendChild(bar);

	const delimiter = (['Kohlberg', 'Crumb'].includes(venue)) ? "<br>" : ", ";

	if (venue == "Crumb") {
		let menu = document.getElementById("menu");

		const disclaimer = document.createElement('h3');
		disclaimer.innerHTML = "Warning: Dietary tags are not yet implemented for Crumb Cafe!<br>";
		disclaimer.style.textAlign = "center";
		disclaimer.style.border = "2px dashed  #EA6C6C";
		disclaimer.style.borderRadius = "4px";
		disclaimer.style.padding = "4px";
		menu.appendChild(disclaimer);

		const container = document.createElement("div")
		container.style.display = "flex"
		menu.appendChild(container)

		const leftSubContainer = document.createElement("div")
		leftSubContainer.style.display = "flex"
		leftSubContainer.style.flexDirection = "column"

		leftSubContainer.style.flexGrow = 1
		container.appendChild(leftSubContainer)

		const rightSubContainer = document.createElement("div")
		rightSubContainer.style.flexGrow = 1
		container.appendChild(rightSubContainer)

		const titleElement = document.createElement('h2');
		titleElement.style.padding = "6px"
		titleElement.innerHTML = "Menu"
		rightSubContainer.appendChild(titleElement);

		var menuElement = document.createElement('p');
		menuElement.innerHTML = subtree["menu"].join("<br>")
		rightSubContainer.appendChild(menuElement);

		for (let list in subtree) {
			if (["time", "menu"].includes(list))
				continue

			const leftInnerContainer = document.createElement("div")
			leftInnerContainer.style.flexGrow = 1
			leftSubContainer.appendChild(leftInnerContainer)

			const titleElement = document.createElement('h2');
			titleElement.style.padding = "6px"
			titleElement.innerHTML = capitalize(list)
			leftInnerContainer.appendChild(titleElement);

			var menuElement = document.createElement('p');
			menuElement.innerHTML = subtree[list].join("<br>")
			leftInnerContainer.appendChild(menuElement);

		}
		return
	}

	generateMenuElement(subtree, inclusions, delimiter);

	return 0;
};

// Construct the page
function constructPage(obj) {
	setTabOnClicks(obj);

	// set title and date
	const title = document.getElementById("title");
	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	title.textContent = "Narples - " + months[new Date().getMonth()] + " " + new Date().getDate();

	try {
		const subtree = obj['Dining Center'];
		let hour = new Date().getHours()
		if (hour < 10) {
			setMenu(subtree.breakfast, 'Dining Center');
			setActiveTab("breakfastTab");
		} else if (hour < 14) {
			if (setMenu(subtree.lunch, "Dining Center")) {
				setMenu(subtree.brunch, "Dining Center")
			};
			setActiveTab("lunchTab");
		} else if (hour < 21) {
			setMenu(subtree.dinner, 'Dining Center');
			setActiveTab("dinnerTab");
		} else {
			setMenu(obj.Crumb, "Crumb")
			setActiveTab("CrumbTab");
		};
	} catch (error) {
		console.log(error);
		const closeElement = document.createElement('h2');
		closeElement.textContent = "Dining Center is closed";
		document.getElementById("menu").appendChild(closeElement);
	};


};

// Set user preferences
function setPrefs() {

	// set the toggle state for tag vis and dark/light modes
	document.getElementById("mfer").checked = localStorage.getItem("dark") == "dark"
	document.getElementById("mfer2").checked = localStorage.getItem("tags") == "true";

	// apply the dark/light theme
	applyTheme(getTheme());

	// set version number in preferences menu
	const versionControl = document.getElementById("version");
	versionControl.textContent = "Running on v" + manifest.version;
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
	if (event.target == document.getElementById("prefMenu") ||
		event.target == document.getElementById("brandyInfo")) {
		$('#prefMenu').hide();
		$('#brandyInfo').hide();
	}
}

// runs the command (darkMode) when the dark mode toggle switch is changed
document.getElementById("darkSwitch").addEventListener("change", toggleTheme);

// runs the command (toggleTags) when the main tag toggle switch is changed
document.getElementById("mfer2").addEventListener("change", toggleTags);








/**
 * Section below pertains to Main function flow
 */

// set theme and other preferences so users dont get flashbanged
setPrefs();

// populate tag switch menu and start event watchers 
for (let id of tagsIDs) {
	createSwitch(id)
	document.getElementById(id).addEventListener("change", () => { watchSwitch(id) })
}

let cachedObj = JSON.parse(localStorage.getItem("data"))

// if nothing is cached OR day has reset, perform a fetch
if (!cachedObj) {
	cachedObj = await getMenus();
	localStorage.setItem("data", JSON.stringify(cachedObj));
	console.log("Null fetched formatted API data: ")
} else {

	let now = new Date();
	let today = new Date(cachedObj["TimeOfGeneration"]);
	let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 5, 0, 0);

	// if we're 00:05 AM on the next day, fetch new data
	// (keep in mind the diningAPI refreshes once a day, at 00:01 AM)
	// maybe change this to check if a hash is different, then pull
	console.log("now:  " + now)
	console.log("new data:  " + today)
	console.log("tomorrow:  " + tomorrow)

	if (Date.parse(now) > Date.parse(tomorrow)) {
		cachedObj = await getMenus();
		localStorage.setItem("data", JSON.stringify(cachedObj));
		console.log("Fetched formatted API data: ")
	} else {
		console.log("Cached formatted API data: ")
	}
}

console.log(cachedObj)

constructPage(cachedObj);




