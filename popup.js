// main Jquery function
$(function(){
    // Variables to store and get today's date elements
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = monthNames[today.getUTCMonth()];
    var darkModeCookie = getCookie("dark");
    console.log(darkModeCookie)

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

    // load in jquery, the program to read the JSON file
    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
    script.type = 'text/javascript';

    // URL to take JSON from
    var staticUrl = 'https://dash.swarthmore.edu/dining_json';

    // definition of the HTML dietary tags
    var vegan = '<abbr class="vegantag" title="Vegan">v</abbr>'
    var halal = '<abbr class="halaltag" title="Halal">h</abbr>'
    var veget = '<abbr class="vegettag" title="Vegetarian">h</abbr>'

    // adds HTML elements in-text for tags
    function format(str){
        return str.replace(/::vegan::/g, vegan).replace(/::halal::/g, 
        halal).replace(/::vegetarian::/g, veget)
    }

    // formats time and title into a single string for titles
    function title(data, id) {
        return data.sharples[id].title+" ("+data.sharples[id].short_time+")"
    }

    function darkMode() {
        // toggles dark mode
        document.body.classList.toggle("dark-mode");
        // updates cookie based on stage
        if (darkModeCookie == 0) {
            setCookie("dark", 1, 9999);
        } else {
            setCookie("dark", 0, 9999)
        }
    }

    if (darkModeCookie == '') {
        setCookie("dark", 1, 9999);
        document.body.classList.toggle("dark-mode");
    }
    else {
        if (darkModeCookie == 1) {
            document.body.classList.toggle("dark-mode");
            document.getElementById("mfer").checked = true
        }else{
            document.getElementById("mfer").checked = false
        }
    }

    $.getJSON(staticUrl, function (data) {
        console.log(data)

        var l = 0;
        var d = 0;

        // define the lunch/brunch and dinner ID values for format functions
        for(let i = 0; i < data.sharples.length ; i++){
            if (data.sharples[i].title == "Lunch" || 
            data.sharples[i].title == "Brunch"){
                l = i
            }
            if (data.sharples[i].title == "Dinner") {
                d = i
            }
        }

        // store the appropriate HTML description items for easy access
        var lunchitems = data.sharples[l].html_description
        var dinneritems = data.sharples[d].html_description

        // Update the HTML Elements:

        // title and date
        document.getElementById("title").innerHTML = 
        "Sharples - " + mm +" " + dd;

        // lunch/brunch title
        document.getElementById("lunch").innerHTML = title(data, l)

        // lunch/brunch items
        document.getElementById("lunch_items").innerHTML = format(lunchitems);

        // dinner title
        document.getElementById("dinner").innerHTML = title(data, d)

        //dinner items
        document.getElementById("dinner_items").innerHTML = format(dinneritems);
    });
});
