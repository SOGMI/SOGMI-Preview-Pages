document.onreadystatechange = function() {
    if (document.readyState === 'complete') {
        closeLoader();
    }
}

function closeLoader() {
        document.getElementById("loaderContainer").style = "display: none"
        document.querySelector("body").classList.remove("loading")
}