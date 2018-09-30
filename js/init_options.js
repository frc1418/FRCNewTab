// If something's wrong with the options (generally, if they aren't set yet),
// clear all options and reset to defaults.
// TODO: Updating isn't exactly graceful. Find a better way to do this.
if (!localStorage.clockMode) localStorage.clockMode = false;
if (!localStorage.teams) localStorage.teams = undefined;
if (!localStorage.name) localStorage.name = true;
if (!localStorage.location) localStorage.location = true;
if (!localStorage.vetting) localStorage.vetting = true;
if (!localStorage.optionsButton) localStorage.optionsButton = true;
if (!localStorage.dynamicTitle) localStorage.dynamicTitle = false;
