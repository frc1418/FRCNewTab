// Aliases for major page elements
var el = {
	number: document.getElementById('number'),
	name: document.getElementById('name'),
	bg: document.getElementById('background'),
	rookie: document.getElementById('rookie')
};

// Pick rand team from team array in data.js
var teamNum = teams[parseInt(Math.random() * teams.length)];

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
		// Set team number and name on page
		el.number.innerHTML = '<a href="https://www.thebluealliance.com/team/' + teamNum + '">' + teamNum + '</a>';
		el.name.innerHTML = team.nickname;
		el.rookie.innerHTML = team.rookie_year;
	}
};

// Make a new request to get list of team media from TBA
var mediaReq = new XMLHttpRequest();
// Get data
mediaReq.open('GET', 'https://www.thebluealliance.com/api/v2/team/frc' + teamNum + '/media?X-TBA-App-Id=erikboesen:frcnewtab:v1.0');
// This is required for some reason
mediaReq.send();
// When the data is ready
mediaReq.onreadystatechange = function() {
	if (mediaReq.readyState == 4 && mediaReq.status == 200) {
		// Parse data for processing
		var media = JSON.parse(mediaReq.responseText);
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
		// Initialize src.
		var src;
		// Check where the media is sourced from. Use this to build a link to the image.
		switch (media[target].type) {
			case 'imgur':
				src = 'http://i.imgur.com/' + media[target].foreign_key + '.png';
				break;
			case 'cdphotothread':
				src = 'https://www.chiefdelphi.com/media/img/' + media[target].details.image_partial;
				break;
		}
		// Create image. This will be used to check if the image is smaller than the window.
		var img = new Image();
        // Give it the proper source.
		img.src = src;
        // When the source is done loading,
		img.onload = function() {
            // Check if the image is smaller than the window.
			if (img.naturalWidth < window.innerWidth) {
                // If it is, blur the bacground image.
				el.bg.style['-webkit-filter'] = 'blur(10px)';
			}
		};

        // Set the src of the real background image.
		el.bg.src = src;

        // TODO: This process could probably be way more efficient. Find a way to improve.
        // TODO: Get rid of all the errors that come from this.
	}
};
