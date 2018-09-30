// If something's wrong with the options (generally, if they aren't set yet),
// clear all options and reset to defaults.
// TODO: This is duplicated in options.js. Combine these somehow.
// TODO: Updating isn't exactly graceful. Find a better way to do this.
if (!localStorage.clockMode) localStorage.clockMode = false;
if (!localStorage.teams) localStorage.teams = undefined;
if (!localStorage.name) localStorage.name = true;
if (!localStorage.location) localStorage.location = true;
if (!localStorage.vetting) localStorage.vetting = true;
if (!localStorage.optionsButton) localStorage.optionsButton = true;
if (!localStorage.dynamicTitle) localStorage.dynamicTitle = false;

// Alias major page elements so we don't have to keep getting them by ID
var el = {
	number: document.getElementById('number'),
	name: document.getElementById('name'),
	location: document.getElementById('location'),
	bg: document.getElementById('background'),
	options: document.getElementById('options')
};


function importData() {
	// If custom teams value is truthy, valid, and not an empty array,
	// replace the data.js teams array with the custom one from localStorage.
	if (localStorage.teams !== '[]' && localStorage.teams !== '' && localStorage.teams !== 'undefined') {
		// TEMPORARY: If the 'teams' data has brackets around it, remove the brackets.
		if (localStorage.teams[0] === '[' || localStorage.teams[localStorage.teams.length - 1] === ']') {
			localStorage.teams = localStorage.teams.substring(1, localStorage.teams.length - 1);
		}
		teams = JSON.parse('[' + localStorage.teams + ']');
	}
}

function loadTeam() {
	// Initialize int-type team number variable
	var teamNum;
	// and string-type team number var (used more for clock mode)
	var teamNumStr;

	// If clock mode is turned on, get the team that corresponds to the current time.
	if (JSON.parse(localStorage.clockMode)) {
		// Get date, current hour, and current minute.
		var d = new Date();
		var hours = d.getHours();
		var minutes = d.getMinutes();
		// Construct team number
		teamNum = hours * 100 + minutes;
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		teamNumStr = hours + ':' + minutes;
	} else {
		// If clock mode is off, choose a random team.
		teamNum = teams[parseInt(Math.random() * teams.length)];
		teamNumStr = teamNum.toString();
	}

	var teamInfo = {
		num: teamNum,
		numStr: teamNumStr
	}

	return teamInfo;
}

function showOptions() {
	// If the option to show the options button is on, show it.
	// (If it's not, it will remain hidden as normal.)
	if (JSON.parse(localStorage.optionsButton)) el.options.style.display = 'block';
}

function getTBAData(teamInfo) {
	try {
		// Create request to get data from TBA
		var req = new XMLHttpRequest();
		// Get data for team
		req.open('GET', 'https://www.thebluealliance.com/api/v3/team/frc' + teamInfo.num + '?X-TBA-Auth-Key=IJ7ECNmOibpHt04EdVs4xS7q5OQkIY5GE7USErbLXK3i4obXAilhJD8VP590o8Ur');
		// Send empty data for conclusion
		req.send();
		// When the data is ready, figure out where an image is and get ready to set it as the background.
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200) {
				// Parse the newly-fetched team data into JSON to get it ready to be used
				team = JSON.parse(req.responseText);

				// Put team number on page if the team exists
				var a = document.createElement('a');
				a.href = 'https://www.thebluealliance.com/team/' + teamInfo.num
				a.appendChild(document.createTextNode(teamInfo.numStr));

				el.number.appendChild(a);
				el.number.parentNode.style.visibility = 'visible';

				// If name showing is enabled,
				if (JSON.parse(localStorage.name)) {
					var a, text;
					// If team has a website that isn't "Coming Soon"
					if (team.website && team.website !== 'Coming Soon') {
						// Make the name a link to the website
						a = document.createElement('a')
						a.href = team.website
						text = document.createTextNode(team.nickname);

						el.name.appendChild(a);
					} else {
						// Insert name without a link
						text = document.createTextNode(team.nickname);
						el.name.appendChild(text);
					}
				} else {
					// Otherwise, delete the name element from the DOM.
					el.name.parentNode.removeChild(el.name);
				}

				// If location showing is on,
				if (JSON.parse(localStorage.location)) {
					// Then set the location onscreen.
					var loc = document.createTextNode(team.city + ', ' + team.country)
					el.location.appendChild(loc);
				} else {
					// Otherwise, remove the location element from the DOM.
					el.location.parentNode.removeChild(el.location);
				}

				if (JSON.parse(localStorage.dynamicTitle)) {
					// Display the team name and number in titlebar.
					document.title = teamInfo.num + ' - ' + team.nickname
				}
			} else if (req.readyState == 4 && req.status != 200) {
				// If the team doesn't exist (for clock mode)
				var num = document.createTextNode(teamInfo.numStr)
				el.number.appendChild(num);
			}
		};
	} catch (e) {}
}

function renderImage(src) {
	console.log('Rendering', src);
	// Create image. This will be used to check if the image is smaller than the window.
	var img = new Image();
	// Give it the proper source.
	img.src = src;
	// When the source is done loading,
	img.onload = function() {
		// Check if the image is smaller than the window.
		if (img.naturalWidth >= window.innerWidth) {
			// If it is, blur the background image.
			el.bg.style['-webkit-filter'] = 'none';
		}
	};

	// Set the src of the real background image.
	el.bg.style.backgroundImage = 'url(' + src + ')';
}

function getImage(info) {
	try {
		// Make a new request to get list of team media from TBA
		var mediaReq = new XMLHttpRequest();

		// Get month and year to determine what year the photo is from
		var date = new Date();

		// When the data is ready,
		mediaReq.onreadystatechange = function() {
			if (mediaReq.readyState == 4 && mediaReq.status == 200) {
				// Parse data for processing
				var media = [];
				try {
					media = JSON.parse(mediaReq.responseText);
				} catch (e) {}
				if (media.length > 0) {
					var images = [];
					// Go through every piece of media and add high quality images to an array
					for (i = 0; i < media.length; i++) {
						// Find media that's an image

						if ((media[i].type === 'imgur' || media[i].type === 'cdphotothread')) {
							// If vetting is on and the image is high quality add it to the array
							if (JSON.parse(localStorage.vetting)) {
								if (media[i].preferred) images.push(i);
							} else {
								images.push(i); // Otherwise add every image
							}
						}
					}
					// Grab a random image if vetting is enabled; otherwise grab the first image
					var target = JSON.parse(localStorage.vetting) ? images[Math.floor(Math.random()*images.length)] : 0;
					// Check where the media is sourced from. Use this to build a link to the image.
					if (target !== null) {
						switch (media[target].type) {
							case 'imgur':
								src = 'http://i.imgur.com/' + media[target].foreign_key + '.png';
								break;
							case 'cdphotothread':
								src = 'https://www.chiefdelphi.com/media/img/' + media[target].details.image_partial;
								break;
						}
					}
				}
				// Put the image into the background (see below).
				renderImage(src);
			} else if (mediaReq.readyState == 4 && mediaReq.status != 200) {
				// Media GET request failed - render a stock image
			}
		};
		// Actually open the request.
		mediaReq.open('GET', 'https://www.thebluealliance.com/api/v3/team/frc' + teamInfo.num + '/media/' + (date.getFullYear() - (date.getMonth() >=4 ? 0 : 1)) + '?X-TBA-Auth-Key=IJ7ECNmOibpHt04EdVs4xS7q5OQkIY5GE7USErbLXK3i4obXAilhJD8VP590o8Ur');
		mediaReq.send();
	} catch (e) {}
	// If there's an error, we'll just render the random image from earlier
	renderImage(src);

	return src;
}

// Import data.js
importData();

// Get and load team number
// Converts to clock mode if appropriate
teamInfo = loadTeam();

// Show options icon if appropriate
showOptions();

// Get data from TBA
getTBAData(teamInfo);

// Initialize background image source as a randomly-chosen fallback image.
var src = '/res/bg/' + (Math.floor(Math.random() * 10) + 1) + '.jpg';

// Get an image source from TBA
// Also renders image on page
getImage(teamInfo);

// TODO: Make this whole process more efficient.
