// swap helper function, taken from https://www.geeksforgeeks.org/bubble-sort/
function swap(arr, xp, yp) {
    var temp = arr[xp];
    arr[xp] = arr[yp];
    arr[yp] = temp;
}

// sort helper function, adopted from https://www.geeksforgeeks.org/bubble-sort/
function bubbleSort(arr) {
    n = arr.length
    var i, j;
    const rank = ['Main 1', 'Main 2', 'Main 3', 'Vegan Main', 'Allergen Choice', 'Dessert']

    for (i = 0; i < n - 2; i += 2) {
        for (j = 0; j < n - i - 2; j += 2) {
            if (rank.indexOf(arr[j].textContent) > rank.indexOf(arr[j + 2].textContent)) {
                swap(arr, j, j + 2);
                swap(arr, j+1, j + 3);
            }
        }
    }
}

// adds HTML elements in-text for tags
// corny/punny titles can go to hell
// this might be causing some lag when popup is loading, should optimize?
function format(str) {
    return str.replace(/::vegan::/g, vegan)
        .replace(/::halal::/g, halal)
        .replace(/::vegetarian::/g, veget)
        .replace(/::egg::/g, egg)
        .replace(/::milk::/g, milk)
        .replace(/::soy::/g, soy)
        .replace(/::wheat::/g, wheat)
        .replace(/::fish::/g, fish)
        .replace(/::gluten free::/g, glutenfree)
        .replace(/::sesame::/g, sesame)
        .replace(/::alcohol::/g, alcohol)
        .replace(/::shellfish::/g, shellfish)
        .replace(/::peanut::/g, peanut)
        .replace(/::tree nut::/g, treenut)
        .replace(/::locally sourced::/g, "")
        .replace(/Classics/g, "Main 1")
        .replace(/World of Flavor/g, "Main 2")
        .replace(/Verdant & Vegan/g, "Vegan Main")
        .replace(/Daily Kneads/g, "Dessert")
        .replace(/Free Zone/g, "Allergen Choice")
        .replace(/Spice</g, "Main 3<")
        .replace(/font-bold text-gray-800 dark:text-gray-200/g, "item")
}

// formats time and title into a single string for titles
function title(data, id) {
    return data.dining_center[id].title + " (" + data.dining_center[id].short_time + ")"
}

// URL to take JSON from
const staticUrl = 'https://dash.swarthmore.edu/dining_json';

// definition of the HTML dietary tags
{
    var vegan = '<abbr class="tag vegan" title="Vegan">v</abbr>'
    var halal = '<abbr class="tag halal" title="Halal">h</abbr>'
    var veget = '<abbr class="tag veget" title="Vegetarian">vg</abbr>'
    var egg = '<abbr class="tag egg" title="Egg">e</abbr>'
    var milk = '<abbr class="tag milk" title="Milk">m</abbr>'
    var soy = '<abbr class="tag soy" title="Soy">s</abbr>'
    var wheat = '<abbr class="tag wheat" title="Wheat">w</abbr>'
    var fish = '<abbr class="tag fish" title="Fish">f</abbr>'
    var glutenfree = '<abbr class="tag gf" title="Gluten Free">gf</abbr>'
    var sesame = '<abbr class="tag sesame" title="Sesame">ses</abbr>'
    var alcohol = '<abbr class="tag alcohol" title="Alcohol">alc</abbr>'
    var shellfish = '<abbr class="tag shellfish" title="Shellfish">sf</abbr>'
    var peanut = '<abbr class="tag peanut" title="Peanut">p</abbr>'
    var treenut = '<abbr class="tag treenut" title="Tree Nut">tn</abbr>'
}

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
$(document).ready(function(){

    // Handles links
    $('body').on('click', 'a', function () {
        document.getElementById("debug").textContent = "clicked"
        chrome.tabs.create({ url: $(this).attr('href') });
        return false;
    });
    
    // Handles dark mode and tag visibility toggles
    function darkMode() {
        // toggles dark mode
        document.getElementById("inner").classList.toggle("dark-mode");
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
        // toggles tags
        // $('.tag').toggle();
        // updates based on stage
        if (typeof (Storage) !== "undefined") {
            if (localStorage.getItem("tags") == "false") {  // turn on  tag visibility
                localStorage.setItem("tags", "true");
                document.getElementById("mfer2").checked = true;
                $('.tag').show();
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
    document.getElementById("displayMode").addEventListener("change", darkMode);

    // runs the command (toggleTags) when the toggle switch is changed
    document.getElementById("tagswitch").addEventListener("change", toggleTags);


    // Handles auto-opening of menus by time of day
    var coll = document.getElementsByClassName("collapsible");
    var i;
    if (hour < 14) {
        coll[0].classList.toggle("active");
        var content = coll[0].nextElementSibling;
        content.style.maxHeight = 100 + "%"
    } else {
        coll[1].classList.toggle("active");
        var content = coll[1].nextElementSibling;
        content.style.maxHeight = 100 + "%";
    }

    // Handles collapsability of the menus
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }

    // Construct the page
    function constructPage() {
        // fetch the JSON from the URL
        var data = [];
        $.ajax({
            url: staticUrl,
            async: false,
            dataType: 'json',
            success: function (json) {
                data = json;
            }
        });

        // debug print, press f12 to see console (on chrome)
        console.log(data)

        // set title and date
        document.getElementById("title").textContent =
            "Narples - " + mm + " " + dd;

        var b = -1;
        var l = -1;
        var d = -1;

        // define the breakfast, lunch/brunch, and dinner ID values
        for (let i = 0; i < data.dining_center.length; i++) {
            if (data.dining_center[i].title == "Breakfast") {
                b = i
            }
            if (data.dining_center[i].title == "Lunch" ||
                data.dining_center[i].title == "Brunch") {
                l = i
            }
            if (data.dining_center[i].title == "Dinner") {
                d = i
            }
        }

        var lunchitems = ""
        var dinneritems = ""
        var exclusions = ["Fired Up", "Field of Greens", "Grillin' Out"]

        const parser = new DOMParser();

        // If no data in the dining center, assume Narples is closed 
        if (jQuery.isEmptyObject(data.dining_center)) {
            document.getElementById("breakfast").textContent = "Closed for Breakfast"
            document.getElementById("lunch").textContent = "Closed for Lunch"
            document.getElementById("dinner").textContent = "Closed for Dinner"
            throw '"error thrown: Dining hall information missing"';
        }

        // if breakfast was not found, assume closed for breakfast
        // else, parse and update the HTML
        if (b == -1) {
            document.getElementById("breakfast").textContent = "Closed for Breakfast"
        } else {
            document.getElementById("breakfast").textContent = ("Open for Breakfast ("
                + data.dining_center[b].short_time + ")")

        }

        // if lunch was not found, assume is closed for lunch
        // else, parse and update the HTML
        if (l == -1) {
            document.getElementById("lunch").textContent = "Closed for Lunch"
        } else {
            var lunchitems = data.dining_center[l].html_description
            var parsed = parser.parseFromString(format(lunchitems), `text/html`)
            // parses HTML tags into a usable list
            var tags = []; for (let tag of parsed.body.children) { tags.push(tag) }
            bubbleSort(tags)

            // lunch/brunch title
            document.getElementById("lunch").textContent = title(data, l)

            // lunch/brunch items
            // insert items in pairs (title, list items)
            for (let i = 0; i < tags.length; i += 2) {
                // if the title is in our exlusions list, don't display it
                if (!exclusions.includes(tags[i].textContent)) {
                    document.getElementById("lunch_items").appendChild(tags[i]);
                    document.getElementById("lunch_items").appendChild(tags[i + 1]);
                }
            }
        }

        // if dinner was not found, assume closed for dinner
        // else, parse and update the HTML
        if (d == -1) {
            document.getElementById("dinner").textContent = "Closed for Dinner"
        } else {
            var dinneritems = data.dining_center[d].html_description
            parsed = parser.parseFromString(format(dinneritems), `text/html`);
            // parses HTML tags into a usable list
            tags = []; for (let tag of parsed.body.children) { tags.push(tag) }
            bubbleSort(tags)

            // dinner title
            document.getElementById("dinner").textContent = title(data, d)

            //dinner items
            // insert items in pairs (title, list items)
            for (let i = 0; i < tags.length; i += 2) {
                // if the title is in our exlusions list, don't display it
                if (!exclusions.includes(tags[i].textContent)) {
                    // append the title
                    document.getElementById("dinner_items").appendChild(tags[i]);
                    // append the bullet point item(s)
                    document.getElementById("dinner_items").appendChild(tags[i + 1]);
                }
            }
        }
        


        // if essies data is not empty, parse and display essie items
        if (!jQuery.isEmptyObject(data.essies)) {
            var str = data.essies[0].description
            var special = str.substring(
                str.indexOf("Special") + 7,
                str.lastIndexOf(". A meal")
            );
            var meal = str.substring(
                str.indexOf("food vendor will be") + 19,
                str.lastIndexOf(". Please be aware")
            );

            // If the string description has "substantial" information (not missing
            // menu item information), then update the menu.
            // Else, assume Essie Mae's is closed and update.
            if (str.length > 192) {
                document.getElementById("essie_special").textContent = special
                document.getElementById("essie_mealplan").textContent = meal
            } else {
                document.getElementById("essie_special").textContent =
                    "Closed for the day"
                document.getElementById("essie_mealplan").textContent =
                    "Closed for the day"
            }
        } else { // if essies information is not available, assume is closed
            document.getElementById("essie_special").textContent =
                "Closed for the day"
            document.getElementById("essie_mealplan").textContent =
                "Closed for the day"
        }
    }

    // Set user preferences
    function setPrefs() {
        if (localStorage.getItem("dark") == "false") {
            document.getElementById("mfer").checked = false
        } else {
            document.getElementById("mfer").checked = true
            document.getElementById("inner").classList.toggle("dark-mode");
        }

        if (localStorage.getItem("tags") == "false") {
            document.getElementById("mfer2").checked = false
            $('.tag').hide();
        } else {
            document.getElementById("mfer2").checked = true
        }
    }

    constructPage();
    setPrefs();

});


