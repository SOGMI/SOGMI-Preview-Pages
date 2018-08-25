const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const md = new Remarkable();

var entryFile = new XMLHttpRequest();
var featImageFile = new XMLHttpRequest();
var seriesFile = new XMLHttpRequest();

entryFile.open("GET", `https://preview.contentful.com/spaces/${spaceID}/environments/${environment}/entries/${entryID}?access_token=${previewToken}&include=1`, true);
entryFile.send();
entryFile.addEventListener("load", getEntry)

function getEntry(){
    var result = JSON.parse(this.responseText)
    console.log(result)
    // Entry Title
    var title = result.fields.title
    var episodeNum = result.fields.episodeNumber
    placeTitle(title,episodeNum)
    console.log("episode " + episodeNum + ": " + title)

    // Entry Description
    var description = result.fields.description
    placeDescription(description);

    // Audio File
    var audio = result.fields.audioLink
    placeAudio(audio)

    // Dates
    var pDate = new Date(result.fields.date);
    var aDate = new Date(result.fields.originalAirDate)
    placeDates(pDate, aDate);

    // Host (speaker)
    var hosts = result.fields.hosts;
    var hostList = ''
    for(var i = 0; i < hosts.length; i++) {
        if (i === 0 ) {
            hostList += hosts[i];
        }
        else {
            hostList += ", " + hosts[i];
        }
    }
    placeHosts(hostList)

    // Tags / Keywords
    var tags = result.fields.keywords
    var tagList = ''
    for(var i = 0; i < tags.length; i++) {
        tagList += `
        <a class="list-item-2-copy">
            <div class="text-block-4">${tags[i]}</div>
        </a>`
    }
    placeTags(tagList);

    // photo credit
    var credit = result.fields.photoCredit
    if (credit !== undefined) {
        giveCredit(credit);
    }

    // featured image
    var featImageId = result.fields.featuredImage.sys.id;
    console.log(featImageId)
    getFeatImage(featImageId)

    // Podcast Series / Show
    var seriesID = result.fields.podcastSeries.sys.id;
    console.log(seriesID);
    getPodcastSeries(seriesID)
}

// simple place functions

function placeTitle(x, num) {
    document.getElementById("mainTitle").innerHTML = `Episode ${num}: ${x}`
    document.getElementById("player-title").innerHTML = `Episode ${num}: ${x}`
}

function placeDescription(x) {
    document.getElementById("mainDescription").innerHTML = md.render(x);
}

function placeAudio(url) {
    document.getElementById("audioURL").href = url
}

function placeDates(published, aired) {
    document.getElementById("publishDate").innerHTML = monthNames[published.getMonth()] + " " + published.getUTCDate() + ", " + published.getFullYear()
    document.getElementById("airDate").innerHTML = monthNames[aired.getMonth()] + " " + aired.getUTCDate() + ", " + aired.getFullYear()
}

function placeHosts(x) {
    document.getElementById("hostList").innerHTML = x
}

function placeTags(tags) {
    document.getElementById("tagList").innerHTML = tags
}

function giveCredit(credit) {
    document.getElementById("photoCredit").innerHTML = credit
}

// get image stuffs

featImageFile.addEventListener("load", placeFeatImage)

function getFeatImage(id) {
    featImageFile.open("GET", `https://preview.contentful.com/spaces/${spaceID}/environments/${environment}/assets/${id}?access_token=${previewToken}`, true);
    featImageFile.send();
}

function placeFeatImage() {
    var result = JSON.parse(this.responseText)
    var url = result.fields.file.url
    console.log(result)
    document.getElementById("mainImage").style = `background-image: URL(${url}?w=800&fit=scale)`
    document.getElementById("playerImage").src = url + "?w=150&h=150&fit=fill&q=85"
}

// get podcast series stuffs

seriesFile.addEventListener("load", placePodcastSeries);

function getPodcastSeries(id) {
    seriesFile.open("GET", `https://preview.contentful.com/spaces/${spaceID}/environments/${environment}/entries/${id}?access_token=${previewToken}&include=1`, true);
    seriesFile.send();
}

function placePodcastSeries() {
    var result = JSON.parse(this.responseText);
    console.log(result)
}