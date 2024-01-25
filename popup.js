import manifest from './manifest.json' assert { type: 'json' };

// // Keywords to sort by for menu items in order
// const keywords = ["chicken", "steak", "beef", "shrimp", "bacon", "sausage", 
// "pork", "pot roast", "meatball", "lamb", "turkey", "tilapia", "salmon", "wing", 
// "fried rice", "curry", "aloo gobi", "pizza", "vindaloo", "cod", "fish", "pollock",
// "falafel", "catfish", "quesadilla", "pancake", "waffle", "tempeh", "tofu", 
// "seitan", "pollock", "masala", "lo mein", "chow mein", "pad thai", "pasta",
// "mahi", "bean bake", "catfish", "risotto", "meatloaf"];

// dictionary of the HTML dietary tags
const tags = {
    vegan: '<abbr class="tag vegan" title="Vegan">v</abbr>',
    vegetarian: '<abbr class="tag vegetarian" title="Vegetarian">vg</abbr>',
    halal: '<abbr class="tag halal" title="Halal">h</abbr>',
    glutenfree: '<abbr class="tag glutenfree" title="Gluten Free">gf</abbr>',
    alcohol: '<abbr class="tag alcohol" title="Alcohol">alc</abbr>',
    egg: '<abbr class="tag egg" title="Egg">e</abbr>',
    fish: '<abbr class="tag fish" title="Fish">f</abbr>',
    milk: '<abbr class="tag milk" title="Milk">m</abbr>',
    peanut: '<abbr class="tag peanut" title="Peanut">p</abbr>',
    sesame: '<abbr class="tag sesame" title="Sesame">ses</abbr>',
    shellfish: '<abbr class="tag shellfish" title="Shellfish">sf</abbr>',
    soy: '<abbr class="tag soy" title="Soy">s</abbr>',
    treenut: '<abbr class="tag treenut" title="Tree Nut">tn</abbr>',
    wheat: '<abbr class="tag wheat" title="Wheat">w</abbr>',
	locallysourced: '',
	organic: '',
};

const tagsIDs = ["vegan", "vegetarian", "halal",
    "glutenfree", "alcohol", "egg", "fish", "milk",
    "peanut", "sesame", "shellfish", "soy", "treenut",
    "wheat"];

// Variables to store and get today's date elements
{
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = monthNames[today.getUTCMonth()];
    var hour = today.getHours();
}

const capitalize = (word) => word[0].toUpperCase() + word.slice(1);

function getThemeSetting() {
    return localStorage.getItem('dark');
}

function setThemeSetting(setting) {
    localStorage.setItem('dark', setting);
}

function setTheme(mode) {
    document.documentElement.dataset.appliedMode = mode;
}

async function getMenus() {
	const response = await fetch('http://dining.sccs.swarthmore.edu/api')
		.catch(error => console.error('Error:', error));
	const data = await response.json();
	return data;
}

// Handles dark mode and tag visibility toggles
function toggleTheme() {
	// updates based on stage
	if (getThemeSetting() == "light") { // turn off dark mode
		setThemeSetting("dark");
		setTheme(getThemeSetting());
	} else {                          // turn off dark mode
		setThemeSetting("light");
		setTheme(getThemeSetting());
	}
}

// toggles visibility of all tags
function toggleTags() {
	if (typeof (Storage) !== "undefined") {
		if (localStorage.getItem("tags") == "false") {

			localStorage.setItem("tags", "true");
			document.getElementById("mfer2").checked = true;
			for (let tag of tagsIDs) { showTag(tag) };

		} else {

			localStorage.setItem("tags", "false");
			document.getElementById("mfer2").checked = false;
			for (let tag of tagsIDs) { hideTag(tag) };

		}
	} else {
		document.getElementById("debug").textContent =
			"If you see this message, email ale3@swarthmore.edu. Error Code: 12b";
	}
}

// refreshes page with tag preferences
function refreshTags() {
	for (let tag of tagsIDs) {
		if (localStorage.getItem("tags") == "true") { //if tags allowed
			if (localStorage.getItem(tag) == "true") {
				switchOnTag(tag);
				showTag(tag);
			} else {
				switchOffTag(tag);
				hideTag(tag);
			}
		} else {
			if (localStorage.getItem(tag) == "true") {
				switchOnTag(tag);
			} else {
				switchOffTag(tag);
			}
			hideTag(tag);
		}
	}
}

// tag local storage and checked status set to off
function switchOffTag(tag) {
	localStorage.setItem(tag, "false");
	document.getElementById(tag).checked = false;
}

// tag local storage and checked status set to on
function switchOnTag(tag) {
	localStorage.setItem(tag, "true");
	document.getElementById(tag).checked = true;
}

// disables visibility of tag, does NOT update local storage or switch
function hideTag(tag) {
	$("." + tag).hide();
}

// enables visibility of tag, does NOT update local storage or switch
function showTag(tag) {
	if (document.getElementById(tag).checked == true) {
		$("." + tag).show();
	}
}

// set the active tab's css style
function setActiveTab(activeTabID) {
	for (let tab of $('.tab')) { tab.style = "" }
	document.getElementById(activeTabID).style["backgroundColor"] = "hsl(216, 33%, 25%)";
	refreshTags();
};

// Construct the page
function constructPage(obj) {
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

	// set title and date
	const title = document.getElementById("title");
	title.textContent = "Narples - " + mm + " " + dd;

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
					string += tags[prop];
				};
			};
			newLst.push(string);
		};

		return newLst.join(delim);
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
            "Hours: " + timeText + "  (aka Kolhberg)" : "Hours: " + timeText;

		document.getElementById("menu").appendChild(timeElement);
		
		const bar = document.createElement('hr');
		document.getElementById("menu").appendChild(bar);

		const delimiter = (venue == 'Kohlberg') ? "<br>" : ", ";
		generateMenuElement(subtree, inclusions, delimiter);

		return 0;
	};

	try {
		const subtree = obj['Dining Center'];
		if (hour < 10) {
			setMenu(subtree.breakfast, 'Dining Center');
			setActiveTab("breakfastTab");
		} else if (hour < 14) {
			if (setMenu(obj['Dining Center'].lunch, "Dining Center")) {
				setMenu(obj['Dining Center'].brunch, "Dining Center")
			};
			setActiveTab("lunchTab");
		} else {
			setMenu(subtree.dinner, 'Dining Center');
			setActiveTab("dinnerTab");
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
	const darkModeSwitch = document.getElementById("mfer");
	if (localStorage.getItem("dark") == "light") {
		darkModeSwitch.checked = false;
		setThemeSetting("light");
		setTheme("light");
	} else {
		darkModeSwitch.checked = true;
		setThemeSetting("dark");
		setTheme("dark");
	}

	const tagVisSwitch = document.getElementById("mfer2");
	if (localStorage.getItem("tags") == "false") {
		tagVisSwitch.checked = false;
		localStorage.setItem("tags", "false");
		$('.tag').hide();
	} else {
		tagVisSwitch.checked = true;
		localStorage.setItem("tags", "true");
	}

	refreshTags();

	// set version number in preferences menu
	const versionControl = document.getElementById("version");
	versionControl.textContent = "Running on v" + manifest.version;
};


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

const modal = document.getElementById("prefMenu");
const brandy = document.getElementById("brandyInfo");
window.onclick = function (event) {
	if (event.target == modal || event.target == brandy) {
		$('#prefMenu').hide();
		$('#brandyInfo').hide();
	}
}

// runs the command (darkMode) when the dark mode toggle switch is changed
document.getElementById("darkSwitch").addEventListener("change", toggleTheme);

// runs the command (toggleTags) when the main tag toggle switch is changed
document.getElementById("toggleTags").addEventListener("change", toggleTags);

// handles tag toggling menu, tag visibility, and local storage
const tagToggles = document.getElementsByClassName("tagswitch");

Array.from(tagToggles).forEach(function (toggle) {
	toggle.addEventListener("change", (event) => {
		let tag = toggle.id.slice(0, -6);
		if (localStorage.getItem("tags") == "true") { // if tags allowed
			// turning tag off
			if (localStorage.getItem(tag) == "true") {
				console.log("allowed, toggling off")
				switchOffTag(tag);
				hideTag(tag);
			} else {
				// turning on tag
				console.log("allowed, toggling on")
				switchOnTag(tag);
				showTag(tag);
			};
		} else { // tags not allowed (not disabling)
			// turning tag off
			if (localStorage.getItem(tag) == "true") {
				console.log("not allowed, toggling off")
				switchOffTag(tag);
			} else {
				// turning on tag
				console.log("not allowed, toggling on")
				switchOnTag(tag);
			};
		};
	});
});


let darkMode = getThemeSetting();
setTheme(darkMode);

const obj = await getMenus();
console.log("Formatted API data: ")
console.log(obj)

constructPage(obj);
setPrefs();



