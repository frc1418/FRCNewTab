// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	// Use default values if there's nothing in storage.
	chrome.storage.sync.get({
		clockMode: false,
        showLocation: true,
        showOptions: true
	}, function(items) {
		document.getElementById('clock').checked = items.clockMode;
        document.getElementById('location').checked = items.showLocation;
        document.getElementById('options').checked = items.showOptions;
	});
}
document.addEventListener('DOMContentLoaded', restore_options);

onchange = function() {
    var clockMode = document.getElementById('clock').checked;
    var showLocation = document.getElementById('location').checked;
    var showOptions = document.getElementById('options').checked;
    chrome.storage.sync.set({
        clockMode: clockMode,
        showLocation: showLocation,
        showOptions: showOptions
    });
};