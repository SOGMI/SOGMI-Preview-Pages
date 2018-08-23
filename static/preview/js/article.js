const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
var md = new Remarkable();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

var entryID = getUrlVars()["id"];
        
var jsonFile = new XMLHttpRequest();
var imageFile = new XMLHttpRequest();
jsonFile.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var results = JSON.parse(this.responseText);
        var markdownContent = results.fields.content
        var removePounds = markdownContent.replace('##', '');
        var removeReturns = removePounds.replace(/(?:\r\n|\r|\n)/g, '');
        var date = new Date(results.fields.date)
        console.log(results)
        
        //Place Title
        document.getElementById("mainTitle").innerHTML = results.fields.title; 
        var seoTitle = results.fields.title + " | Sons of God Ministries International";
        if (seoTitle.length > 70 ) {
            var seoTitleTruncated = seoTitle.substring(0,70)
            document.getElementById("seoTitle").innerHTML = seoTitleTruncated + "...";
        }
        else {
            document.getElementById("seoTitle").innerHTML = seoTitle
        }

        //Render Content
        document.getElementById("content").innerHTML = md.render(markdownContent);
        document.getElementById("seoUrl").innerHTML = "https://www.sogmi.org/articles/" + results.fields.slug + "/"
        
        if (results.fields.description !== undefined ) {
            document.getElementById("seoDescription").innerHTML = results.fields.description
        }
        else {
            var truncatedContent = removeReturns.substring(0,320)
            document.getElementById("seoDescription").innerHTML = truncatedContent + "..."
            console.log(truncatedContent + "...")
        }

        document.getElementById("authorName").innerHTML = results.fields.authors;
        document.getElementById("date").innerHTML = monthNames[date.getMonth()] + " " + date.getUTCDate() + ", " + date.getFullYear();
        if (results.fields.collections !== undefined ) {
            document.getElementById("series").style = "display:block";
            document.getElementById("seriesName").innerHTML = results.fields.collections
        };
        var resultField = results.fields
        for (let field of Object.keys(results.fields)) {
            if (field == 'featuredImage') {
                var featImageID = results.fields[field].sys.id
                console.log(featImageID)
                imageFile.open("Get", `https://preview.contentful.com/spaces/` + spaceID + '/environments/master/assets/' + featImageID + `?access_token=` + previewToken, true);
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

jsonFile.open("GET", `https://preview.contentful.com/spaces/${spaceID}/environments/${environment}/entries/${entryID}?access_token=${previewToken}`, true);
jsonFile.send();
