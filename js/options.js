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

o.clock.checked = JSON.parse(localStorage.clockMode);
if (localStorage.teams !== undefined && localStorage.teams !== 'undefined' && localStorage.teams !== '') {
    o.teams.value = JSON.parse(localStorage.teams);
} else {
    o.teams.value = '';
}
o.name.checked = JSON.parse(localStorage.name);
o.location.checked = JSON.parse(localStorage.location);
o.optionsButton.checked = JSON.parse(localStorage.optionsButton);

console.log('Loaded options!');


function updateOptions() {
	localStorage.clockMode = o.clock.checked;
	localStorage.teams = o.teams.value;
    localStorage.name = o.name.checked;
    localStorage.location = o.location.checked;
    localStorage.optionsButton = o.optionsButton.checked;

	console.log('Options updated!');
}

// TODO: Should call the function directly. Very strange that this doesn't work.
oninput = function() { updateOptions(); };
onchange = function() { updateOptions(); };