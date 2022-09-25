
// document.querySelector('#amount').addEventListener('keyup', function () {
//     //get input's value and call your functions here

// });

var script = document.createElement('script');
var stuff;
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';

var staticUrl = 'https://dash.swarthmore.edu/dining_json';

$.getJSON(staticUrl, function (data) {
    stuff = data
});

document.getElementById('thebutton').onclick = doSomeStuff;
function doSomeStuff() {
    /*
    data.sharples is a list of 5 objects. 
    Each of these objects can be accessed by their respective index,
    data.sharples[n], where n is 0-4.
    Each object has 6 data members:
        - .description
        - .html_description
        - .startdate
        - .enddate
        - .title
        - .short_time
    */
    document.getElementById("lunch").innerHTML = stuff.sharples[1].title
    document.getElementById("lunch_items").innerHTML = stuff.sharples[1].html_description
    document.getElementById("dinner").innerHTML = stuff.sharples[3].title
    document.getElementById("dinner_items").innerHTML = stuff.sharples[3].html_description
}