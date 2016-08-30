// If something's wrong with the options (generally, if they aren't set yet),
// clear all options and reset to defaults.
if (localStorage.length != 5) {
	localStorage.clear();
	localStorage.clockMode = false;
	localStorage.teams = undefined;
	localStorage.name = true;
	localStorage.location = true;
	localStorage.optionsButton = true;
}

// Aliases for major page elements
var el = {
	number: document.getElementById('number'),
	name: document.getElementById('name'),
	location: document.getElementById('location'),
	bg: document.getElementById('background'),
    options: document.getElementById('options')
};

var isMilitary = true;
var teamNum;
var teamNumText;

if (localStorage.teams !== '[]' && localStorage.teams !== undefined && localStorage.teams !== '') {
	teams = JSON.parse(localStorage.teams);
}


// Pick rand team from team array in data.js
if (JSON.parse(localStorage.clockMode)) {
	// Get date
	var d = new Date();
	var hours = d.getHours();
	if (!isMilitary) {
		hours %= 12;
	}
	// Construct team number
	hours *= 100;
	timeTeam = hours + d.getMinutes();
	teamNum = timeTeam;

	// Create text version
	teamNumText = teamNum.toString();

	// Insert colon
	var teamNumArray = teamNumText.split('');
	teamNumArray.splice((teamNumText.length - 2), 0, ':');
	teamNumText = teamNumArray.join('');
	console.log(teamNumText);
} else {
	teamNum = teams[parseInt(Math.random() * teams.length)];
	teamNumText = teamNum.toString();
}

// Put team number on page
el.number.innerHTML = '<a href="https://www.thebluealliance.com/team/' + teamNum + '">' + teamNumText + '</a>';

if (JSON.parse(localStorage.optionsButton)) el.options.style.display = 'block';

try {
	// Create request to get data from TBA
	var req = new XMLHttpRequest();
	// Get data for team
	req.open('GET', 'https://www.thebluealliance.com/api/v2/team/frc' + teamNum + '?X-TBA-App-Id=erikboesen:frcnewtab:v1.0');
	// Send empty data for conclusion
	req.send();
	// When the data is ready
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			// Parse the data into JSON to get it ready to be used
			team = JSON.parse(req.responseText);

			// If name showing is enabled,
			if (JSON.parse(localStorage.name)) {
				// If team has a website that isn't "Coming Soon"
				if (team.website && team.website !== 'Coming Soon') {
					// Make the name a link to the website
					el.name.innerHTML = '<a href="' + team.website + '">' + team.nickname + '</a>';
				} else {
					// Insert name without a link
					el.name.innerHTML = team.nickname;
				}
			} else {
				el.name.parentNode.removeChild(el.name);
			}

			if (JSON.parse(localStorage.location)) {
				el.location.innerHTML = team.location;
			} else {
				el.location.parentNode.removeChild(el.location);
			}
		}
	};
} catch (e) {}

// Define source variable
var src = '../bg/' + (Math.floor(Math.random() * 10) + 1) + '.jpg';

try {
	// Make a new request to get list of team media from TBA
	var mediaReq = new XMLHttpRequest();

	mediaReq.onreadystatechange = function() {
		if (mediaReq.readyState == 4 && mediaReq.status == 200) {
			// Parse data for processing
			var media = [];
			try {
				media = JSON.parse(mediaReq.responseText);
			} catch (e) {}
			console.log(media.length);
			if (media.length > 0) {
				var target;
				// Go through every piece of media
				for (i = 0; i < media.length; i++) {
					// Find media that's an image
					if (media[i].type === 'imgur' || media[i].type === 'cdphotothread') {
						// Set target to that image and break loop.
						target = i;
						break;
					}
				}
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
			// Log URL of background image
        	// Get data
			// Put the image into the background (see below).
			renderImage();
		}
	};

    mediaReq.open('GET', 'https://www.thebluealliance.com/api/v2/team/frc' + teamNum + '/media?X-TBA-App-Id=erikboesen:frcnewtab:v1.0');
    mediaReq.send();
} catch (e) {
	renderImage();
}

function renderImage() {
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


// TODO: This process could probably be way more efficient. Find a way to improve.