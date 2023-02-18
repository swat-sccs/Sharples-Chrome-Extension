# sharples-chrome-extension
Chrome Extension that displays a popup of the Dining Center's Menu

Written by Alex Le, Class of 2024

Omar Khan, Class of 2025

That's it. That's literally all it does. 
It takes a JSON file from Swarthmore and nicely formats it
into a little popup chrome extension. You can find the 
extension here:

Chrome: https://tinyurl.com/sharpleschromeext

Firefox: https://tinyurl.com/sharplesfirefoxext

OperaGX: Unavailable due to the fact that OperaGX has terrible reviewing 
processes for publishing extensions (We've currently been waiting 11 days as of
this last edit, compared to Google and Firefox's 2 days).

You can copy the code and use it as you want. Credit us if you feel 
like it, don't credit us if you don't feel like it.

The only part of the code we do not own is jquery-3.6.1.js.
All rights, work, etc are all reserved by the creators of
JQuery. This program only uses it as a local file in the
extension.

You can access the JSON file that contains the dining hall
menu information at the link:
https://dash.swarthmore.edu/dining_json

To install the Extension for testing purposes,
1) Download the repository as a folder to your computer and
unzip it into a folder
2) Go to "chrome://extensions" on the chrome browser
3) In the upper right hand corner of the screen, enable
developer mode
4) In the newly opened bar, click on "Load unpacked"
5) Choose the folder that you downloaded 
6) Viola, extension is loaded.

IF YOU ARE INSTALLING FOR CHROME:
1) Click on the "Extensions" icon at the top right corner of 
the browser (puzzle piece icon, to the right of the URL bar).
2) Find "Sharples Menu" under the newly opened list
3) Click on the pin icon next to the extension
4) In the newly appeared icon next to the "Extensions" icon 
you clicked on in step 1, click on the icon to see the menu.

IF YOU ARE INSTALLING FOR FIREFOX:
1) Delete "manifest.json"
2) Rename "manifest-firefox.json" to "manifest.json"
3) Open Firefox
4) In the URL bar, type in "about:debugging"
5) On the left-hand side of the page, click on "This Firefox"
6) Click on "Load Temporary Add-on..."
7) Choose the "manifest.json"
8) In the newly appeared extension icon in the upper right
corner of the screen, click the icon to see the menu.


Things to add in the next versions:
 - Menus of the week/day after
    - Show menu of tomorrow (highlighted or bolded) after dinner of today
 - Create SASS/SCSS file
 - Add filters for dietary restrictions and allergies
 - Transition to a new .js framework...? (Update 2.0)
