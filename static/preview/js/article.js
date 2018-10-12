const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const md = new Remarkable();

var featImageID = ''
var featuredImage = ''
var thumbnailImage = ''
var profilePic = ''

var jsonFile = new XMLHttpRequest();
var featImageFile = new XMLHttpRequest();
var authorFile = new XMLHttpRequest();
var authorPhoto = new XMLHttpRequest();

// Entry JSON File Request
jsonFile.open("GET", `https://preview.contentful.com/spaces/${spaceID}/environments/${environment}/entries/${entryID}?access_token=${previewToken}&include=1`, true);
jsonFile.send();

// Entry JSON File Results
jsonFile.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var results = JSON.parse(this.responseText);
        var markdownContent = results.fields.content
        var removePounds = markdownContent.replace('##', '');
        var removeReturns = removePounds.replace(/(?:\r\n|\r|\n)/g, '');
        var pDate = new Date(results.sys.createdAt)
        console.log(results)
        
        //Place Title
        var title = results.fields.title;
        var seoTitle = results.fields.title + " | Sons of God Ministries International";

        document.getElementById("mainTitle").innerHTML = title; 

        if (seoTitle.length > 70 ) {
            var seoTitleTruncated = seoTitle.substring(0,70)
            document.getElementById("seoTitle").innerHTML = seoTitleTruncated + "...";
        }
        else {
            document.getElementById("ogTitle").innerHTML = seoTitle
        }

        document.getElementById("ogTitle").innerHTML = title;

        //Place Content
        document.getElementById("content").innerHTML = md.render(markdownContent);
        
        //place slug in seo view
        document.getElementById("seoUrl").innerHTML = "https://www.sogmi.org/articles/" + results.fields.slug + "/"
        
        //place description in SEO View
        if (results.fields.description !== undefined ) {
            var ogDescription = results.fields.description            
            document.getElementById("seoDescription").innerHTML = results.fields.description
            document.getElementById("ogDescription").innerHTML = ogDescription.substring(0,155)
        }
        // if Description isn't set make description from Content
        else {
            var truncatedContent = removeReturns.substring(0,320)
            document.getElementById("seoDescription").innerHTML = truncatedContent + "..."
            console.log(truncatedContent + "...")
        }

        // get Author Name
        document.getElementById("authorName").innerHTML = results.fields.authors;
        
        // get Date
        document.getElementById("date").innerHTML = monthNames[pDate.getMonth()] + " " + pDate.getUTCDate() + ", " + pDate.getFullYear();
        
        //get collection
        if (results.fields.collections !== undefined ) {
            document.getElementById("series").style = "display:block";
            document.getElementById("seriesName").innerHTML = results.fields.collections
        };
        
        // Object Fields (nested fields)
        var resultField = results.fields
        for (let field of Object.keys(results.fields)) {
            if (field == 'featuredImage') {
                featImageID = results.fields[field].sys.id
                // fetch JSON file for Image Asset. See function loadFeatImage() below
                loadFeatImage(featImageID)
            }
            if (field == 'authorRef') {
                authorId = results.fields[field].sys.id
                // fetch JSON file for Author. See function loadAuthor() below
                loadAuthor(authorId)
            }
            if (field == 'tags') {
                var tags = '';
                for( i = 0; i < resultField.tags.length; i++) {
                    tags += `<a class="link-block-5 w-inline-block"><div>${resultField.tags[i]}</div></a>`
                }
                document.getElementById('tagList').innerHTML = tags
            }
        }
    }
};

// Featured Image Request
featImageFile.addEventListener("load", getImage);

function loadFeatImage(x) {
    featImageFile.open("Get", `https://preview.contentful.com/spaces/${spaceID}/environments/${environment}/assets/${x}?access_token=${previewToken}`, true )
    featImageFile.send();
}

function getImage() {
    console.log(JSON.parse(this.responseText))
    var result = JSON.parse(this.responseText)
    var url = result.fields.file.url
    featuredImage = url
    console.log(url)    
    document.getElementById("featImage").style = `position: relative; background-image:URL( ${url}?w=1600&h=800&q=50&fit=fill ); background-size: cover; background-position: center; background-repeat: no-repeat`
    document.getElementById("ogImage").src = url + "?w=500&h=260&q=60&fit=fill"
    document.getElementById("ogImage").style = "display: block;"
}

// Author Request 
authorFile.addEventListener("load", getAuthor);

function loadAuthor(x) {
    authorFile.open("GET", `https://preview.contentful.com/spaces/${spaceID}/environments/${environment}/entries/${x}?access_token=${previewToken}&include=1`, true);
    authorFile.send();
}

function getAuthor() {
    var result = JSON.parse(this.responseText);
    console.log(result)
    document.getElementById("AuthorName").innerHTML = result.fields.title
    document.getElementById("authorPosition").innerHTML = result.fields.position
    document.getElementById("authorBio").innerHTML = result.fields.bio
    document.getElementById("authorFName").innerHTML = result.fields.firstName
    document.getElementById("authorProfilePic").alt = "photo of " + result.fields.title
    document.getElementById("authorProfilePic").title = "photo of " + result.fields.title
    var profileSys = Object.getOwnPropertyDescriptor(result.fields.profilePhoto.sys, "id").value
    console.log(profileSys)
    loadAuthorPhoto(profileSys);
}

authorPhoto.addEventListener("load", getAuthorPhoto);

function loadAuthorPhoto(x) {
    authorPhoto.open("Get", `https://preview.contentful.com/spaces/${spaceID}/environments/${environment}/assets/${x}?access_token=${previewToken}`, true )
    authorPhoto.send();
}

function getAuthorPhoto() {
    var result = JSON.parse(this.responseText);
    profilePic = result.fields.file.url
    document.getElementById("authorProfilePic").src = profilePic + "?w=200&h=200&fit=fill&f=face&r=300&q=80" 
}