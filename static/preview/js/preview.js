
function changeView(x, y) {
    var views = document.querySelectorAll('div.pageViewMode')
    for (var i = 0; i < views.length; i++) {
        views[i].classList.remove('active');
    }
    var buttons = document.querySelectorAll('div.previewLink')
    for(var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    document.getElementById(x).classList.add("active")
    document.getElementById(y).classList.add("active")
}