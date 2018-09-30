// If something's wrong with the options (generally, if they aren't set yet),
// clear all options and reset to defaults.
// TODO: This is duplicated in newtab.js. Combine these somehow.
// TODO: Updating isn't exactly graceful. Find a better way to do this.
if (!localStorage.clockMode) localStorage.clockMode = false;
if (!localStorage.teams) localStorage.teams = undefined;
if (!localStorage.name) localStorage.name = true;
if (!localStorage.location) localStorage.location = true;
if (!localStorage.vetting) localStorage.vetting = true;
if (!localStorage.optionsButton) localStorage.optionsButton = true;
if (!localStorage.dynamicTitle) localStorage.dynamicTitle = false;

// Alias all the data inputs so we don't have to keep getting them by ID later on
var o = {
    clock: document.getElementById('clock'),
    teams: document.getElementById('teams'),
    name: document.getElementById('name'),
    location: document.getElementById('location'),
    vetting: document.getElementById('vetting'),
    optionsButton: document.getElementById('options-button'),
    dynamicTitle: document.getElementById('dynamic-title')
};

// Get option values from localStorage and set all the inputs to those values.
o.clock.checked = JSON.parse(localStorage.clockMode);
// TEMPORARY: If the 'teams' data has brackets around it, remove the brackets.
if (localStorage.teams[0] === '[' || localStorage.teams[localStorage.teams.length - 1] === ']') {
    localStorage.teams = localStorage.teams.substring(1, localStorage.teams.length - 1);
}
// If the custom team list is valid, put it into the textbox.
// If the list doesn't exist or isn't valid, the textbox will be left empty.
if (localStorage.teams !== undefined && localStorage.teams !== 'undefined' && localStorage.teams !== '') {
    o.teams.value = localStorage.teams;
}
o.name.checked = JSON.parse(localStorage.name);
o.location.checked = JSON.parse(localStorage.location);
o.vetting.checked = JSON.parse(localStorage.vetting);
o.optionsButton.checked = JSON.parse(localStorage.optionsButton);
o.dynamicTitle.checked = JSON.parse(localStorage.dynamicTitle);

console.log('Loaded options!');

// Function to update localStorage with new values from inputs.
function updateOptions() {
    localStorage.clockMode = o.clock.checked;
    localStorage.teams = o.teams.value;
    localStorage.name = o.name.checked;
    localStorage.location = o.location.checked;
    localStorage.vetting = o.vetting.checked;
    localStorage.optionsButton = o.optionsButton.checked;
    localStorage.dynamicTitle = o.dynamicTitle.checked;

    console.log('Options updated!');
}

// Update localStorage, using the above function, when options are changed.
o.teams.oninput = updateOptions
onchange = updateOptions
