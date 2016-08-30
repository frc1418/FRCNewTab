if (localStorage.length != 5) {
    localStorage.clear();
	localStorage.clockMode = false;
	localStorage.teams = undefined;
	localStorage.name = true;
	localStorage.location = true;
    localStorage.optionsButton = true;
}

document.getElementById('clock').checked = JSON.parse(localStorage.clockMode);
if (localStorage.teams !== undefined && localStorage.teams !== 'undefined' && localStorage.teams !== '') {
    document.getElementById('teams').value = JSON.parse(localStorage.teams);
} else {
    document.getElementById('teams').value = '';
}
document.getElementById('name').checked = JSON.parse(localStorage.name);
document.getElementById('location').checked = JSON.parse(localStorage.location);
document.getElementById('options-button').checked = JSON.parse(localStorage.optionsButton);

console.log('Loaded options!');


function updateOptions() {
	localStorage.clockMode = document.getElementById('clock').checked;
	localStorage.teams = document.getElementById('teams').value;
    localStorage.name = document.getElementById('name').checked;
    localStorage.location = document.getElementById('location').checked;
    localStorage.optionsButton = document.getElementById('options-button').checked;

	console.log('Options updated!');
}

// TODO: Should call the function directly. Very strange that this doesn't work.
oninput = function() { updateOptions(); };
onchange = function() { updateOptions(); };