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

// main Jquery function
$(document).ready(function(){

    $('body').on('click', 'a', function () {
        chrome.tabs.create({ url: $(this).attr('href') });
        return false;
    });

    // Variables to store and get today's date elements
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = monthNames[today.getUTCMonth()];
    var darkModeCookie = getCookie("dark");


    // runs the command (darkMode) when the toggle switch is changed
    document.getElementById("displayMode").addEventListener("change", darkMode);

    function setCookie(name, value, exp_days) {
        var d = new Date();
        d.setTime(d.getTime() + (exp_days * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        var cname = name + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cname) == 0) {
                return c.substring(cname.length, c.length);
            }
        }
        return "";
    }

    function deleteCookie(name) {
        var d = new Date();
        d.setTime(d.getTime() - (60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = name + "=;" + expires + ";path=/";
    }

    // URL to take JSON from
    var staticUrl = 'https://dash.swarthmore.edu/dining_json';

    // definition of the HTML dietary tags
    var vegan = '<abbr class="tag vegan" title="Vegan">v</abbr>'
    var halal = '<abbr class="tag halal" title="Halal">h</abbr>'
    var veget = '<abbr class="tag veget" title="Vegetarian">vg</abbr>'
    // extra dietary tags
    var egg = '<abbr class="tag egg" title="Egg">e</abbr>'
    var milk = '<abbr class="tag milk" title="Milk">m</abbr>'
    var soy = '<abbr class="tag soy" title="Soy">s</abbr>'
    var wheat = '<abbr class="tag wheat" title="Wheat">w</abbr>'
    var fish = '<abbr class="tag fish" title="Fish">f</abbr>'
    var glutenfree = '<abbr class="tag gf" title="Gluten Free">gf</abbr>'
    var sesame = '<abbr class="tag sesame" title="Sesame">ses</abbr>'

    // adds HTML elements in-text for tags
    // corny/punny titles can go to hell
    // this might be causing some lag when popup is loading, should optimize?
    function format(str){
        return str.replace(/::vegan::/g, vegan)
        .replace(/::halal::/g,halal)
        .replace(/::vegetarian::/g, veget)
        .replace(/::egg::/g, egg)
        .replace(/::milk::/g, milk)
        .replace(/::soy::/g, soy)
        .replace(/::wheat::/g, wheat)
        .replace(/::fish::/g, fish)
        .replace(/::gluten free::/g, glutenfree)
        .replace(/::sesame::/g, sesame)
        .replace(/::locally sourced::/g, "")
        .replace(/Classics/g, "Main 1")
        .replace(/World of Flavor/g, "Main 2")
        .replace(/Verdant & Vegan/g, "Vegan Main")
        .replace(/Daily Kneads/g, "Dessert")
        .replace(/Free Zone/g, "Allergen Choice")
        .replace(/Spice/g, "Main 3")
        .replace(/font-bold text-gray-800 dark:text-gray-200/g, "item")    
    }


    // formats time and title into a single string for titles
    function title(data, id) {
        return data.dining_center[id].title+" ("+data.dining_center[id].short_time+")"
    }

    function darkMode() {
        // toggles dark mode
        document.getElementById("inner").classList.toggle("dark-mode");
        // updates cookie based on stage
        if (darkModeCookie == 0) {
            setCookie("dark", 1, 9999);
        } else {
            setCookie("dark", 0, 9999)
        }
    }

    if (darkModeCookie == '') {
        setCookie("dark", 1, 9999);
        document.getElementById("inner").classList.toggle("dark-mode");
    }
    else {
        if (darkModeCookie == 1) {
            document.getElementById("inner").classList.toggle("dark-mode");
            document.getElementById("mfer").checked = true
        }else{
            document.getElementById("mfer").checked = false
        }
    }

    
    $.getJSON(staticUrl, function (data) {
        // debug print, press f12 to see console (on chrome)
        console.log(data)

        // set title and date
        document.getElementById("title").textContent =
            "Narples - " + mm + " " + dd;   

        var l = -1;
        var d = -1;

        if (jQuery.isEmptyObject(data.dining_center)){
            document.getElementById("lunch").textContent = "Closed for Lunch"
            document.getElementById("dinner").textContent = "Closed for Dinner"
            throw '"error thrown: Dining hall information missing"';
        }

        // define the lunch/brunch and dinner ID values for format functions
        for(let i = 0; i < data.dining_center.length ; i++){
            if (data.dining_center[i].title == "Lunch" || 
            data.dining_center[i].title == "Brunch"){
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
        

        // if lunch was not found, then assume dining_center is closed for lunch
        // else, parse and update the HTML
        if(l == -1){
            document.getElementById("lunch").textContent = "Closed for Lunch"
        } else {
            var lunchitems = data.dining_center[l].html_description
            var parsed = parser.parseFromString(format(lunchitems), `text/html`)
            // parses HTML tags into a usable list
            var tags = []; for (let tag of parsed.body.children){tags.push(tag)}
            bubbleSort(tags)
            
            // lunch/brunch title
            document.getElementById("lunch").textContent = title(data, l)

            // lunch/brunch items
            // insert items in pairs (title, list items)
            for (let i = 0; i < tags.length; i+=2) {
                // if the title is in our exlusions list, don't display it
                if (!exclusions.includes(tags[i].textContent)){
                    document.getElementById("lunch_items").appendChild(tags[i]);
                    document.getElementById("lunch_items").appendChild(tags[i+1]);
                }
            }
        }

        // if dinner was not found, then assume dining_center is closed for dinner
        // else, parse and update the HTML
        if(d == -1){
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
        if (!jQuery.isEmptyObject(data.essies)){
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
        
    });
});
