$(function(){
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = monthNames[today.getUTCMonth()];
    var yyyy = today.getFullYear();

    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
    script.type = 'text/javascript';

    var staticUrl = 'https://dash.swarthmore.edu/dining_json';

    $.getJSON(staticUrl, function (data) {
        console.log(data)
        document.getElementById("title").innerHTML = "Sharples - " + mm +" "+ dd;
        document.getElementById("lunch").innerHTML = data.sharples[1].title + " (" + data.sharples[1].short_time + ")"
        document.getElementById("lunch_items").innerHTML = data.sharples[1].html_description
        document.getElementById("dinner").innerHTML = data.sharples[3].title + " (" + data.sharples[3].short_time + ")"
        document.getElementById("dinner_items").innerHTML = data.sharples[3].html_description 
    });
});
