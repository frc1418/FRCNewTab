// If something's wrong with the options (generally, if they aren't set yet),
// clear all options and reset to defaults.
// TODO: This is duplicated in newtab.js. Combine these somehow.
if (localStorage.length != 5) {
    localStorage.clear();
    localStorage.clockMode = false;
    localStorage.teams = undefined;
    localStorage.name = true;
    localStorage.location = true;
    localStorage.optionsButton = true;
}

// Alias all the data inputs so we don't have to keep getting them by ID later on
var o = {
    clock: document.getElementById('clock'),
    teams: document.getElementById('teams'),
    name: document.getElementById('name'),
    location: document.getElementById('location'),
    optionsButton: document.getElementById('options-button')
};

// Get option values from localStorage and set all the inputs to those values.
o.clock.checked = JSON.parse(localStorage.clockMode);
// TEMPORARY: If the 'teams' data has brackets around it, remove the brackets.
if (localStorage.teams[0] === '[' || localStorage.teams[localStorage.teams.length - 1] === ']') {
    console.log(localStorage.teams);
    localStorage.teams = localStorage.teams.substring(1, localStorage.teams.length - 1);
    console.log(localStorage.teams);
}
// If the custom team list is valid, put it into the textbox.
// If the list doesn't exist or isn't valid, the textbox will be left empty.
if (localStorage.teams !== undefined && localStorage.teams !== 'undefined' && localStorage.teams !== '') {
    o.teams.value = localStorage.teams;
}
o.name.checked = JSON.parse(localStorage.name);
o.location.checked = JSON.parse(localStorage.location);
o.optionsButton.checked = JSON.parse(localStorage.optionsButton);

console.log('Loaded options!');

// Function to update localStorage with new values from inputs.
function updateOptions() {
    localStorage.clockMode = o.clock.checked;
    localStorage.teams = o.teams.value;
    localStorage.name = o.name.checked;
    localStorage.location = o.location.checked;
    localStorage.optionsButton = o.optionsButton.checked;

    console.log('Options updated!');
}

// Update localStorage, using the above function, when options are changed.
// TODO: Should call the function directly. Very strange that this doesn't work.
oninput = function() { updateOptions(); };
onchange = function() { updateOptions(); };
