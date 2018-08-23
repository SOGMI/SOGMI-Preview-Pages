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
const space = 'vfgh62eq5a4k';
const token = '65908ab908b947afe0358c98653707553c437e02601d3d22082d8ab3c8a83b42'
        
var jsonFile = new XMLHttpRequest();
var imageFile = new XMLHttpRequest();
jsonFile.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var results = JSON.parse(this.responseText);
        var markdownContent = results.fields.content
        var date = new Date(results.fields.date)
        console.log(results)
        document.getElementById("mainTitle").innerHTML = results.fields.title;
        document.getElementById("content").innerHTML = md.render(markdownContent);
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
                imageFile.open("Get", `https://preview.contentful.com/spaces/` + space + '/environments/master/assets/' + featImageID + `?access_token=` + token, true);
            }
        }
    }
};

function imageListener() {
    if (imageFile.readyState==4 && imageFile.status==200) {
        var imResults = JSON.parse(this.responseText);
        console.log(imResults)
    }
}
imageFile.addEventListener("load", imageListener)

jsonFile.open("GET", "https://preview.contentful.com/spaces/vfgh62eq5a4k/environments/master/entries/4ROB3IbuNGcYw0mWecMyQU?access_token=65908ab908b947afe0358c98653707553c437e02601d3d22082d8ab3c8a83b42", true);
jsonFile.send();
