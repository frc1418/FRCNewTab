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

// Alias major page elements so we don't have to keep getting them by ID
var el = {
	number: document.getElementById('number'),
	name: document.getElementById('name'),
	location: document.getElementById('location'),
	bg: document.getElementById('background'),
	options: document.getElementById('options')
};


// If custom teams value is truthy, valid, and not an empty array,
// replace the data.js teams array with the custom one from localStorage.
if (localStorage.teams !== '[]' && localStorage.teams !== '' && localStorage.teams !== 'undefined') {
	// TEMPORARY: If the 'teams' data has brackets around it, remove the brackets.
	if (localStorage.teams[0] === '[' || localStorage.teams[localStorage.teams.length - 1] === ']') {
		localStorage.teams = localStorage.teams.substring(1, localStorage.teams.length - 1);
	}
	teams = JSON.parse('[' + localStorage.teams + ']');
}

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

// Put team number on page
el.number.innerHTML = '<a href="https://www.thebluealliance.com/team/' + teamNum + '">' + teamNumStr + '</a>';

// If the option to show the options button is on, show it.
// (If it's not, it will remain hidden as normal.)
if (JSON.parse(localStorage.optionsButton)) el.options.style.display = 'block';

try {
	// Create request to get data from TBA
	var req = new XMLHttpRequest();
	// Get data for team
	req.open('GET', 'https://www.thebluealliance.com/api/v2/team/frc' + teamNum + '?X-TBA-App-Id=erikboesen:frcnewtab:v1.0');
	// Send empty data for conclusion
	req.send();
	// When the data is ready, figure out where an image is and get ready to set it as the background.
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			// Parse the newly-fetched team data into JSON to get it ready to be used
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
				// Otherwise, delete the name element from the DOM.
				el.name.parentNode.removeChild(el.name);
			}

			// If location showing is on,
			if (JSON.parse(localStorage.location)) {
				// Then set the location onscreen.
				el.location.innerHTML = team.location;
			} else {
				// Otherwise, remove the location element from the DOM.
				el.location.parentNode.removeChild(el.location);
			}

			// Display the team name and number in titlebar.
			el.number.insertAdjacentHTML('beforeend', '<title>FRC Team ' + teamNum + ' - ' + team.nickname + '</title>');

		}
	};
} catch (e) {}

// Initialize background image source as a randomly-chosen fallback image.
var src = '../res/bg/' + (Math.floor(Math.random() * 10) + 1) + '.jpg';

try {
	// Make a new request to get list of team media from TBA
	var mediaReq = new XMLHttpRequest();

	// When the data is ready,
	mediaReq.onreadystatechange = function() {
		if (mediaReq.readyState == 4 && mediaReq.status == 200) {
			// Parse data for processing
			var media = [];
			try {
				media = JSON.parse(mediaReq.responseText);
			} catch (e) {}
			console.log(media.length);
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
			renderImage();
		}
	};
	// Actually open the request.
	mediaReq.open('GET', 'https://www.thebluealliance.com/api/v2/team/frc' + teamNum + '/media?X-TBA-App-Id=erikboesen:frcnewtab:v1.0');
	mediaReq.send();
} catch (e) {
	// If there's a problem, just render the fallback image we created a link to earlier.
	renderImage();
}

var content = document.getElementById('content');
var dismiss = document.getElementById('dismiss');
// Hide the content div if hide is toggled.
content.addEventListener('mouseover', function() {
	dismiss.style.display = "block";
});
content.addEventListener('mouseout', function() {
	dismiss.style.display = "none";
});
dismiss.addEventListener('click', function() {
	content.style.display = content.style.display == "none" ? "block" : "none";
});

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


// TODO: Make this whole process more efficient.
