// main Jquery function
$(function(){

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
    var vegan = '<abbr class="vegantag" title="Vegan">v</abbr>'
    var halal = '<abbr class="halaltag" title="Halal">h</abbr>'
    var veget = '<abbr class="vegettag" title="Vegetarian">vg</abbr>'
    // extra dietary tags
    var egg = '<abbr class="eggtag" title="Egg">E</abbr>'
    var milk = '<abbr class="milktag" title="Milk">M</abbr>'
    var soy = '<abbr class="soytag" title="Soy">S</abbr>'
    var wheat = '<abbr class="wheattag" title="Wheat">W</abbr>'
    var fish = '<abbr class="fishtag" title="Fish">F</abbr>'
    var glutenfree = '<abbr class="gftag" title="Gluten Free">GF</abbr>'
    // adds HTML elements in-text for tags
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
        .replace(/::locally sourced::/g, "")
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
        console.log(data)

        var l = -1;
        var d = -1;

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


        const parser = new DOMParser();
        var parsed = parser.parseFromString(format(lunchitems), `text/html`);
        var tags = parsed.getElementsByTagName(`*`);

        // if lunch was not found, then assume dining_center is closed for lunch
        // else, parse and update the HTML
        if(l == -1){
            document.getElementById("lunch").textContent = "Closed for Lunch"
        } else {
            var lunchitems = data.dining_center[l].html_description
            // lunch/brunch title
            document.getElementById("lunch").textContent = title(data, l)

            // lunch/brunch items
            for (const tag of tags) {
                document.getElementById("lunch_items").appendChild(tag);
            }
        }

        // if dinner was not found, then assume dining_center is closed for dinner
        // else, parse and update the HTML
        if(d == -1){
            document.getElementById("dinner").textContent = "Closed for Dinner"
        } else {
            var dinneritems = data.dining_center[d].html_description
            // dinner title
            document.getElementById("dinner").textContent = title(data, d)

            //dinner items
            parsed = parser.parseFromString(format(dinneritems), `text/html`);
            tags = parsed.getElementsByTagName(`*`);
            for (const tag of tags) {
                document.getElementById("dinner_items").appendChild(tag);
            }
        }


        // set title and date
        document.getElementById("title").textContent =
            "New Sharples - " + mm + " " + dd;


        // parse and display essie items
        var str = data.essies[0].description
        var special = str.substring(
            str.indexOf("Special") + 7,
            str.lastIndexOf(". A meal")
        );
        var meal = str.substring(
            str.indexOf("food vendor will be")+19,
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
    });
});
