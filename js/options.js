// Saves options to chrome.storage
function save_options() {
  var isClockMode = document.getElementById('clock').checked;
  chrome.storage.sync.set({
    isClockMode: isClockMode
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);
  });
}

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
document.getElementById('save').addEventListener('click', save_options);
