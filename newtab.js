validTeam = false;
//do {
    var random = parseInt(Math.random() * 7000 + 1);
    var req = null;
    req = new XMLHttpRequest();
    req.open('GET', 'http://thebluealliance.com/api/v2/team/frc' + random, true);
    req.setRequestHeader('X-TBA-App-Id', 'erikboesen:frcnewtab:v1.0');
    req.send();
    if (req.responseText.length > 1) validTeam = true;
//} while (!validTeam);



console.log(random);