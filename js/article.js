(function() {
    var doc = document,
        root = navigator.userAgent.indexOf('Chrome') != -1 ? doc.body : doc.documentElement || doc.body,
        win = window,
        height = parseInt(win.innerHeight),
        user = doc.getElementById('user'),
        top = parseInt(win.getComputedStyle(user, null)['top']),
        offset = height / 2 - 60, //avatar's height is 120
        avatarTimeout = 0;

    function scrollAvatar() {
        clearTimeout(avatarTimeout);
        avatarTimeout = setTimeout(function() {
            top = root.scrollTop + offset;
            user.style.top = top + 'px';
        }, 500);
    }

    /*
        Progress Bar
    */
    var progressBar = doc.createElement('div'),
        progressTimeout;
    progressBar.className = 'progressbar';
    progressBar.innerHTML = '<div class="progress"></div>';
    doc.body.appendChild(progressBar);
    progressBar = progressBar.getElementsByTagName('div')[0];

    function progress() {
        clearTimeout(progressTimeout);
        progressTimeout = setTimeout(function() {
            progressBar.style.width = ((root.scrollTop + win.innerHeight) / root.scrollHeight) * 100 + '%';
        }, 500);
    }
    progress();

    win.onscroll = function() {
        scrollAvatar();
        progress();
    }

})()