(function() {
    var doc = document,
        body = doc.body,
        win = window,
        height = parseInt(win.innerHeight),
        user = doc.getElementById('user'),
        top = parseInt(win.getComputedStyle(user, null)['top']),
        offset = height / 2 - 60, //avatar's height is 120
        globalID = 0;

    if(!isNaN(top)) {
        win.onscroll = function() {
            clearTimeout(globalID);
            globalID = setTimeout(function() {
                top = body.scrollTop + offset;
                user.style.top = top + 'px';
            }, 500);
        }
    }
})()