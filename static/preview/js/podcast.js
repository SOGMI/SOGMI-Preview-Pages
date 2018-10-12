const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const md = new Remarkable();

var episodeTitle
var episodeNum
var seriesTitle
var metaDescription
var episodeSlug

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
    episodeTitle = title

    // episode number
    var episode = result.fields.episodeNumber
    episodeNum = episode
    placeTitle(title,episode)
    console.log("episode " + episode + ": " + title)

    // Slug
    episodeSlug = result.fields.slug

    // Entry Description
    var description = result.fields.description
    placeDescription(description);

    // Audio File
    var audio = result.fields.audioLink
    placeAudio(audio)

    // Dates
    var pDate = new Date(result.sys.createdAt);
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
    getFeatImage(featImageId)

    // Podcast Series / Show
    var seriesID = result.fields.podcastSeries.sys.id;
    getPodcastSeries(seriesID)

    placeSeoViews();
}

// simple place functions

function placeTitle(x, num) {
    document.getElementById("mainTitle").innerHTML = `Episode ${num}: ${x}`
    document.getElementById("player-title").innerHTML = `Episode ${num}: ${x}`
}

function placeDescription(x) {
    document.getElementById("mainDescription").innerHTML = md.render(x);
    metaDescription = x.replace(/(?:\r\n|\r|\n)/g, '')
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
    document.getElementById("mainImage").style = `background-image: URL(${url}?w=800&fit=scale)`
    document.getElementById("playerImage").src = url + "?w=150&h=150&fit=fill&q=85"
    document.getElementById("ogImage").src = url + "?w=500&h=260&fit=fill&q=60"
    document.getElementById("ogImage").style = "display:block"
}

// get podcast series stuffs

seriesFile.addEventListener("load", placePodcastSeries);

function getPodcastSeries(id) {
    seriesFile.open("GET", `https://preview.contentful.com/spaces/${spaceID}/environments/${environment}/entries/${id}?access_token=${previewToken}&include=1`, true);
    seriesFile.send();
}

function placePodcastSeries() {

    var result = JSON.parse(this.responseText);
    seriesTitle = result.fields.title
    // place series title
    document.getElementById("player-series").innerHTML = seriesTitle
    // get series image
    var albumImage = result.fields.albumImage.sys.id
    var featimage = result.fields.featuredImage.sys.id
    getSeriesImages(albumImage, featimage)
    placeSeoViews();
}

var albumImageRequest = new XMLHttpRequest
var seriesFeaturedRequest = new XMLHttpRequest
albumImageRequest.addEventListener("load", openAlbumImage)
seriesFeaturedRequest.addEventListener("load", openSeriesFeatured)

function getSeriesImages(albumcover, featimage) {
    albumImageRequest.open("GET", `https://preview.contentful.com/spaces/${spaceID}/environments/${environment}/assets/${albumcover}?access_token=${previewToken}`, true)
    albumImageRequest.send();

    seriesFeaturedRequest.open("GET", `https://preview.contentful.com/spaces/${spaceID}/environments/${environment}/assets/${featimage}?access_token=${previewToken}`, true)
    seriesFeaturedRequest.send();
}

function openAlbumImage() {
    result = JSON.parse(this.responseText);
    document.getElementById("mainSeriesImage").src = result.fields.file.url + "?w=340&q=85"
}

function openSeriesFeatured() {
    result = JSON.parse(this.responseText);
    document.getElementById("subscribeModalBackground").style = `background-image: linear-gradient(342deg, #1e4d68, rgba(15, 31, 56, .73)), url(${result.fields.file.url}?w=700&q=50)`
}

// place SEO stuff
function placeSeoViews() {
    var seoFullTitle = `Episode ${episodeNum}: ${episodeTitle} | ${seriesTitle}`
    if (seoFullTitle.length > 70) {
        document.getElementById("seoTitle").innerHTML = seoFullTitle.substring(0,70) + "..."
    }
    else {
        document.getElementById("seoTitle").innerHTML = seoFullTitle
    }
    if (metaDescription.length > 320) {
        document.getElementById("seoDescription").innerHTML = metaDescription.substring(0,320) + "..."
    }
    else {
        document.getElementById("seoDescription").innerHTML = metaDescription
    }
    
    document.getElementById("seoUrl").innerHTML = `https://www.sogmi.org/podcasts/${episodeSlug}`

    document.getElementById("ogTitle").innerHTML = seoFullTitle
    if (metaDescription.length > 300) {
        document.getElementById("ogDescription").innerHTML = metaDescription.substring(0,300) + "..."
    }
    else {
        document.getElementById("ogDescription").innerHTML = metaDescription
    }
}
