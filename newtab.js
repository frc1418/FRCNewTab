var el = {
	number: document.getElementById('number'),
	name: document.getElementById('name')
};

var teamNum = teams[parseInt(Math.random() * teams.length)];

var req = new XMLHttpRequest();
req.open('GET', 'https://www.thebluealliance.com/api/v2/team/frc' + teamNum + '?X-TBA-App-Id=erikboesen:frcnewtab:v1.0', false);
req.send();
team = JSON.parse(req.responseText);
el.number.innerHTML = teamNum;
el.name.innerHTML = team.nickname;

var mediaReq = new XMLHttpRequest();
mediaReq.open('GET', 'http://www.thebluealliance.com/api/v2/team/frc' + teamNum + '/media?X-TBA-App-Id=erikboesen:frcnewtab:v1.0', false);
mediaReq.send();
var media = JSON.parse(mediaReq.responseText);
console.log(media);
var target;
for (i = 0; i < media.length; i++) {
    if (media[i].type === 'imgur' || media[i].type === 'cdphotothread') {
        target = i;
        break;
    }
}
var src;
switch (media[target].type) {
    case 'imgur':
        src = 'http://i.imgur.com/' + media[target].foreign_key + '.png';
        break;
    case 'cdphotothread':
        src = 'https://www.chiefdelphi.com/media/img/' + media[target].details.image_partial;
        break;
}
console.log(src);
document.body.style.backgroundImage = 'url(' + src + ')';
