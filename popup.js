import { DiningObject } from "./DiningObject.js";

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
    glutenfree: '<abbr class="tag gf" title="Gluten Free">gf</abbr>',
    alcohol: '<abbr class="tag alcohol" title="Alcohol">alc</abbr>',
    egg: '<abbr class="tag egg" title="Egg">e</abbr>',
    fish: '<abbr class="tag fish" title="Fish">f</abbr>',
    milk: '<abbr class="tag milk" title="Milk">m</abbr>',
    peanut: '<abbr class="tag peanut" title="Peanut">p</abbr>',
    sesame: '<abbr class="tag sesame" title="Sesame">ses</abbr>',
    shellfish: '<abbr class="tag shellfish" title="Shellfish">sf</abbr>',
    soy: '<abbr class="tag soy" title="Soy">s</abbr>',
    treenut: '<abbr class="tag treenut" title="Tree Nut">tn</abbr>',
    wheat: '<abbr class="tag wheat" title="Wheat">w</abbr>'
};

const tagsIDs = ["vegan", "vegetarian", "halal",
    "glutenfree", "alcohol", "egg", "fish", "milk",
    "peanut", "sesame", "shellfish", "soy", "treenut",
    "wheat", "beta"];

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

// main Jquery function; code below only runs if document is loaded
$(document).ready(async function(){
    const capitalize = (word) => word[0].toUpperCase() + word.slice(1);

    // toggles tag menu
    $('body').on('click', '#button', function () {
        $('#tagMenu').toggle();
    });
    $('body').on('click', '.closebtn', function () {
        $('#tagMenu').toggle();
    });

    // Handles links
    $('body').on('click', 'a', function () {
        document.getElementById("debug").textContent = "DEBUG PRINT:clicked, remove line 45";
        chrome.tabs.create({ url: $(this).attr('href') });
        return false;
    });
    
    // Handles dark mode and tag visibility toggles
    function darkMode() {
        // toggles dark mode
        document.getElementById("inner").classList.toggle("dark-mode");
        document.getElementById("content").classList.toggle("content-dark-mode");
        // updates based on stage
        if (typeof (Storage) !== "undefined") {
            if (localStorage.getItem("dark") == "false") { // turn on  dark mode
                localStorage.setItem("dark", "true");
                document.getElementById("mfer").checked = true;
            } else {                          // turn off dark mode
                localStorage.setItem("dark", "false");
                document.getElementById("mfer").checked = false;
            }
        } else {
            document.getElementById("debug").textContent = "If you see this message, email ale3@swarthmore.edu. Error Code: 12a";
        }
    }

    function toggleTags() {
        if (typeof (Storage) !== "undefined") {
            if (localStorage.getItem("tags") == "false") {  // turn on  tag visibility
                localStorage.setItem("tags", "true");
                document.getElementById("mfer2").checked = true;
                for (let tag of tagsIDs) {
                    if (localStorage.getItem(tag) == "true") {
                        $("."+tag).show();
                        if (tag == "beta") {
                            $("#coords").show();
                        }
                    };
                };
            } else {                         // turn off tag visibility
                localStorage.setItem("tags", "false");
                document.getElementById("mfer2").checked = false;
                $('.tag').hide();
            }
        } else {
            document.getElementById("debug").textContent = 
            "If you see this message, email ale3@swarthmore.edu. Error Code: 12b";
        }
    }

    // runs the command (darkMode) when the toggle switch is changed
    document.getElementById("darkSwitch").addEventListener("change", darkMode);

    // runs the command (toggleTags) when the toggle switch is changed
    document.getElementById("toggleTags").addEventListener("change", toggleTags);

    const tagToggles = document.getElementsByClassName("tagswitch");

    Array.from(tagToggles).forEach(function (toggle) {
        console.log(toggle.id + " event listener added")
        toggle.addEventListener("change", (event) => {
            let id = toggle.id.slice(0, -6);
            if (typeof (Storage) !== "undefined") {
                if (localStorage.getItem(id) == "true") {
                    localStorage.setItem(id, "false");
                    document.getElementById(id).checked = false;
                    $('.' + id).hide();
                    if (id == "beta") {
                        $("#coords").hide();
                    }
                } else {
                    localStorage.setItem(id, "true");
                    document.getElementById(id).checked = true;
                    $('.' + id).show();
                    if (id == "beta") {
                        $("#coords").show();
                    } 
                }
            } else {
                document.getElementById("debug").textContent = "If you see this message, email ale3@swarthmore.edu. Error Code: 13a";
            }
        }); 
    });

    // set the active tab's css style
    function setActiveTab (activeTabID){
        for (let tab of $('.tab')) {
            tab.style = ""
        }
        document.getElementById(activeTabID).style["backgroundColor"] = "hsl(216, 33%, 25%)";
        for (let tag of tagsIDs) {
            if (localStorage.getItem(tag) == "true") {
                document.getElementById(tag).checked = true;
                if (tag == "beta") {
                    $("#coords").show();
                }
            } else {
                document.getElementById(tag).checked = false;
                $('.' + tag).hide();
                if (tag == "beta") {
                    $("#coords").hide();
                };
            };
        };
    };

    // Construct the page
    function constructPage() {
        $('body').on('click', '#breakfastTab', function () {
            setMenu(obj['Dining Center'].breakfast, "Dining Center");
            setActiveTab("breakfastTab");
        });
        $('body').on('click', '#lunchTab', function () {
            setMenu(obj['Dining Center'].lunch, "Dining Center");
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
            setMenu(obj.Kohlberg, "Kholberg");
            setActiveTab("KohlbergTab");
        });

        // set title and date
        document.getElementById("title").textContent = "Narples - " + mm + " " + dd;

        // turns objectified menu into a parsed string, returned string 
        // MUST BE SANITIZED.
        function formatMenu(items,activeTags){
            var newLst = [];
            for(let i = 0; i < items.length; i++){
                var string = items[i].item;
                for (let prop of items[i].properties){
                    if(activeTags.includes(prop)){
                        string += tags[prop];
                    };
                };
                newLst.push(string);
            };
            return newLst.join(', ');
        };

        // unpuns the menu names
        function unpun(title){
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

        function setMenu(subtree, venue){
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
                close.textContent = (venue == "Kholberg") ? 
                    "Venue (aka Kholberg) is closed" : "Venue is closed";

                document.getElementById("menu").appendChild(close);
                document.getElementById("menu").appendChild(bar);
                return;
            };


            // set an HTML sanitizer for the menu items
            const san = new Sanitizer();

            // temporarily set list of Tags that we want to display
            // and discretely define what sections are allowed
            var activeTags = ['vegan', 'vegetarian', 'halal', 'peanut', 'egg', 'wheat'];
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
            const timeText = subtree.start + ' - ' + subtree.end;
            timeElement.textContent = (venue == "Kohlberg") ?
             "(aka Kolhberg)  Hours: " + timeText : "Hours: " + timeText;
            document.getElementById("menu").appendChild(timeElement);
            const bar = document.createElement('hr');
            document.getElementById("menu").appendChild(bar);

            switch (venue){
                case 'Dining Center':
                    var errors = [];

                    // set the menu contents
                    for (let menu of inclusions) {
                        if (subtree[menu]) {
                            const titleElement = document.createElement('h2');
                            const titleText = menu;
                            titleElement.textContent = unpun(titleText);
                            document.getElementById("menu").appendChild(titleElement);

                            const menuElement = document.createElement('p');
                            const menuText = formatMenu(subtree[menu], activeTags);
                            menuElement.setHTML(menuText, { sanitizer: san });
                            document.getElementById("menu").appendChild(menuElement);
                        } else {
                            errors.push(menu);
                        };
                    };
                    console.log("Menus not found: " + errors.join(", "));
                    break;
                case 'Essies':
                    var errors = [];

                    // set the menu contents
                    for (let menu of inclusions) {
                        if (subtree[menu]) {
                            const titleElement = document.createElement('h2');
                            const titleText = capitalize(menu);
                            titleElement.textContent = unpun(titleText);
                            document.getElementById("menu").appendChild(titleElement);

                            const menuElement = document.createElement('p');
                            const menuText = subtree[menu];
                            menuElement.setHTML(menuText, { sanitizer: san });
                            document.getElementById("menu").appendChild(menuElement);
                        } else {
                            errors.push(menu);
                        };
                    };
                    console.log("Menus not found: " + errors.join(", "));
                    break;
                case 'Kholberg':
                    var errors = [];

                    // set the menu contents
                    for (let menu of inclusions) {
                        if (subtree[menu]) {
                            const titleElement = document.createElement('h2');
                            const titleText = capitalize(menu);
                            titleElement.textContent = unpun(titleText);
                            document.getElementById("menu").appendChild(titleElement);

                            const menuElement = document.createElement('p');
                            var menuText = '';
                            try{
                                menuText = formatMenu(subtree[menu], activeTags);
                            } catch (error) {
                                menuText = subtree[menu];
                            }
                            menuElement.setHTML(menuText, { sanitizer: san });
                            document.getElementById("menu").appendChild(menuElement);
                        } else {
                            errors.push(menu);
                        };
                    };
                    console.log("Menus not found: " + errors.join(", "));
                    break;
            };
        };

        try{
            const subtree = obj['Dining Center'];
            if(hour < 10){
                setMenu(subtree.breakfast, 'Dining Center');
                setActiveTab("breakfastTab");
            } else if(hour < 14){
                setMenu(subtree.lunch, 'Dining Center');
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
        if (localStorage.getItem("dark") == "false") {
            document.getElementById("mfer").checked = false;
        } else {
            document.getElementById("mfer").checked = true;
            document.getElementById("inner").classList.toggle("dark-mode");
            document.getElementById("content").classList.toggle("content-dark-mode");
        }

        if (localStorage.getItem("tags") == "false") {
            document.getElementById("mfer2").checked = false;
            $('.tag').hide();
        } else {
            document.getElementById("mfer2").checked = true;
        }


        for(let tag of tagsIDs) {
            if (localStorage.getItem(tag) == "true") {
                document.getElementById(tag).checked = true;
                if (tag == "beta") {
                    $("#coords").show();
                }  
            } else {
                document.getElementById(tag).checked = false;
                $('.' + tag).hide();
                if (tag == "beta") {
                    $("#coords").hide();
                }
            }
        }
    };

    // Store the object under an alias, if you'd like
    const obj = await DiningObject();

    console.log(obj);

    constructPage();
    setPrefs();

    // PLAYGROUND START, DELETE OR IMPLEMENT CODE PAST THIS POINT

    /**
     * Notes to self: 
     * So basically, make a popup menu for users to manage their 
     * dietary tag visibility. When the user finishes and exits the screen,
     * run the constructPage() command again to refresh the menus.
     * 
     * Make the setHTML into a forloop with nested try-catch statements?
     * 
     * 
     */
    const konami = "ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightbaEnter";
    const node = document.getElementById("node");
    node.volume = 0.05;
    var keyStrokes = '';
    document.onkeydown = function (data) {
        // const newSound = node.cloneNode();
        // newSound.volume = 0.05;
        // newSound.play();
        keyStrokes += data.key;
        if (keyStrokes.includes(konami)){
            keyStrokes = '';
            node.play();
        };
    };

});



