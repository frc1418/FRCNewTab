// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	// Use default value clockMode = 'military' and isClockMode = false.
	chrome.storage.sync.get({
		isClockMode: false
	}, function(items) {
		document.getElementById('clock').checked = items.isClockMode;
	});
}
document.addEventListener('DOMContentLoaded', restore_options);

onchange = function() {
    var isClockMode = document.getElementById('clock').checked;
    chrome.storage.sync.set({
        isClockMode: isClockMode
    });
};