document.getElementById('clock').checked = JSON.parse(localStorage.clockMode);
if (localStorage.teams !== undefined) document.getElementById('teams').value = localStorage.teams;

console.log('Loaded options!');

onchange = function() {
	localStorage.clockMode = document.getElementById('clock').checked;
    localStorage.teams = document.getElementById('teams').value;

    console.log('Options updated!');
};