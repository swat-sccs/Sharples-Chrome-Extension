import { DiningObject } from "./DiningObject.js";

// Keywords to sort by for menu items in order
const keywords = ["chicken", "steak", "beef", "shrimp", "bacon", "sausage", 
"pork", "pot roast", "meatball", "lamb", "turkey", "tilapia", "salmon", "wing", 
"fried rice", "curry", "aloo gobi", "pizza", "vindaloo", "cod", "fish", "pollock",
"falafel", "catfish", "quesadilla", "pancake", "waffle", "tempeh", "tofu", 
"seitan", "pollock", "masala", "lo mein", "chow mein", "pad thai", "pasta",
"mahi", "bean bake", "catfish", "risotto", "meatloaf"];

// dictionary of the HTML dietary tags
const tags = {
    vegan: '<abbr class="tag vegan" title="Vegan">v</abbr>',
    halal: '<abbr class="tag halal" title="Halal">h</abbr>',
    vegetarian: '<abbr class="tag veget" title="Vegetarian">vg</abbr>',
    egg: '<abbr class="tag egg" title="Egg">e</abbr>',
    milk: '<abbr class="tag milk" title="Milk">m</abbr>',
    soy: '<abbr class="tag soy" title="Soy">s</abbr>',
    wheat: '<abbr class="tag wheat" title="Wheat">w</abbr>',
    fish: '<abbr class="tag fish" title="Fish">f</abbr>',
    glutenfree: '<abbr class="tag gf" title="Gluten Free">gf</abbr>',
    sesame: '<abbr class="tag sesame" title="Sesame">ses</abbr>',
    alcohol: '<abbr class="tag alcohol" title="Alcohol">alc</abbr>',
    shellfish: '<abbr class="tag shellfish" title="Shellfish">sf</abbr>',
    peanut: '<abbr class="tag peanut" title="Peanut">p</abbr>',
    treenut: '<abbr class="tag treenut" title="Tree Nut">tn</abbr>'
};

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
        content.style.maxHeight = 100 + "%";
    } else {
        coll[1].classList.toggle("active");
        var content = coll[1].nextElementSibling;
        content.style.maxHeight = 100 + "%";
    }

    // Handles collapsability of the menus
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            for (let content of document.getElementsByTagName("h2")){
                content.nextElementSibling.style.maxHeight = null
            }
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = "100%";
            }
        });
    }

    // Construct the page
    function constructPage() {

        // turns objectified menu into a parsed string, returned string 
        // MUST BE SANITIZED.
        function formatMenu(items,activeTags){
            for(let i = 0; i < items.length; i++){
                var string = items[i].item;
                for (let prop of items[i].properties){
                    if(activeTags.includes(prop)){
                        string += tags[prop];
                    };
                };
                items[i] = string;
            };
            return items.join(', ');
        };

        // set title and date
        document.getElementById("title").textContent = "Narples - " + mm + " " + dd;

        // if breakfast was not found, assume closed for breakfast
        // else, parse, sanitize,and set the HTML
        try {
            var subtree = obj['Dining Center'].breakfast;
            document.getElementById("breakfast").textContent = ("Open for Breakfast (" + subtree.start + ' - ' + subtree.end + ")");
        } catch (error) {
            console.log("Breakfast not found.")
            document.getElementById("breakfast").textContent = "Closed for Breakfast";
        }

        // set an HTML sanitizer for the menu items
        const san = new Sanitizer();

        var activeTags = ['vegan', 'vegetarian', 'halal', 'peanut', 'egg', 'wheat']

        // if lunch was not found, assume is closed for lunch
        // else, parse, sanitize, and set the HTML
        try {
            subtree = obj['Dining Center'].lunch;
            document.getElementById("lunch").textContent = "Lunch (" + subtree.start + ' - ' + subtree.end + ")";
            document.getElementById('lmain1').setHTML(formatMenu(subtree['Classics'], activeTags), { sanitizer: san });
            document.getElementById('lmain2').setHTML(formatMenu(subtree['World of Flavor'], activeTags), { sanitizer: san });
            document.getElementById('lmain3').setHTML(formatMenu(subtree['Spice'], activeTags), { sanitizer: san });
            document.getElementById('lmainv').setHTML(formatMenu(subtree['Verdant & Vegan'], activeTags), { sanitizer: san });
            document.getElementById('lmaina').setHTML(formatMenu(subtree['Free Zone'], activeTags), { sanitizer: san });
            document.getElementById('lmaind').setHTML(formatMenu(subtree['Daily Kneads'], activeTags), { sanitizer: san });
        } catch (error) {
            try {
                subtree = obj['Dining Center'].brunch;
                document.getElementById("lunch").textContent = "Lunch (" + subtree.start + ' - ' + subtree.end + ")";
                document.getElementById('lmain1').setHTML(formatMenu(subtree['Classics'], activeTags), { sanitizer: san });
                document.getElementById('lmain2').setHTML(formatMenu(subtree['World of Flavor'], activeTags), { sanitizer: san });
                document.getElementById('lmain3').setHTML(formatMenu(subtree['Spice'], activeTags), { sanitizer: san });
                document.getElementById('lmainv').setHTML(formatMenu(subtree['Verdant & Vegan'], activeTags), { sanitizer: san });
                document.getElementById('lmaina').setHTML(formatMenu(subtree['Free Zone'], activeTags), { sanitizer: san });
                document.getElementById('lmaind').setHTML(formatMenu(subtree['Daily Kneads'], activeTags), { sanitizer: san });
            } catch (error) {
                console.log(error)
                document.getElementById("lunch").textContent = "Closed for Lunch";
                $('.lunch').toggle();
            }
        }

        // if dinner was not found, assume closed for dinner
        // else, parse, sanitize, and set the HTML
        try {
            subtree = obj['Dining Center'].dinner;
            document.getElementById("dinner").textContent = "Dinner (" + subtree.start + ' - ' + subtree.end + ")";
            document.getElementById('dmain1').setHTML(formatMenu(subtree['Classics'], activeTags), { sanitizer: san });
            document.getElementById('dmain2').setHTML(formatMenu(subtree['World of Flavor'], activeTags), { sanitizer: san });
            document.getElementById('dmain3').setHTML(formatMenu(subtree['Spice'], activeTags), { sanitizer: san });
            document.getElementById('dmainv').setHTML(formatMenu(subtree['Verdant & Vegan'], activeTags), { sanitizer: san });
            document.getElementById('dmaina').setHTML(formatMenu(subtree['Free Zone'], activeTags), { sanitizer: san });
            document.getElementById('dmaind').setHTML(formatMenu(subtree['Daily Kneads'], activeTags), { sanitizer: san });
        } catch (error) {
            console.log(error)
            document.getElementById("dinner").textContent = "Closed for Dinner";
            $('.dinner').toggle();
        }

        // If no data in Essies, assume Essies is closed 
        subtree = obj.Essies;
        if (!$.isEmptyObject(subtree)){
            for(let item in subtree){
                document.getElementById('essies_'+item).textContent = subtree[item];
            }
            for (let child of document.getElementById('essiesBlock').getElementsByTagName('h3')){
                if(!child.nextElementSibling.textContent){
                    $(child).toggle();
                }
            }
        } else {
            $('.essie').toggle();
            document.getElementById('essie_closed').textContent = "Closed for the day";
        }
    }

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
    }

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



