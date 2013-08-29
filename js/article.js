(function() {
    var doc = document,
        body = doc.body,
        root = navigator.userAgent.indexOf('Chrome') != -1 ? doc.body : doc.documentElement || doc.body,
        win = window,
        height = parseInt(win.innerHeight),
        top,
        offset = height / 2 - 60, //avatar's height is 120
        avatarTimeout = 0,
        user,
        avatar,
        progressBar,
        nav,
        progressTimeout;

    var template = {
        avatar: '<div class="avatar" id="avatar"><img src="../imgs/avatar.jpg" width="120" height="120"></div>',

        progressbar: '<div class="progress"></div>',

        nav: '<div id="nav">\
                <ul>\
                    <li><a href="#" id="prev"><span>Prev</span></a></li>\
                    <li><a href="#" id="backToMenu"><span>Index</span></a></li>\
                    <li><a href="#" id="next"><span>Next</span></a></li>\
                </ul>\
            </div>'
    }

    function init() {
        user = doc.createElement('aside');
        user.id = user.className = 'user';
        user.innerHTML = template.avatar + template.nav;
        body.appendChild(user);
        avatar = doc.getElementById('avatar');
        nav = doc.getElementById('nav');

        progressBar = doc.createElement('div');
        progressBar.className = 'progressbar';
        progressBar.innerHTML = template.progressbar;
        body.appendChild(progressBar);
        progressBar = progressBar.getElementsByTagName('div')[0];

        top = parseInt(win.getComputedStyle(user, null)['top']);
        win.onscroll = function() {
            scrollAvatar();
            progress();
        };

        win.onload = function() {
            body.className = "";
        };

        avatar.onclick = function() {
            nav.className = nav.className == 'on' ? '' : 'on';
        }
    }

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
    function progress() {
        clearTimeout(progressTimeout);
        progressTimeout = setTimeout(function() {
            progressBar.style.width = ((root.scrollTop + win.innerHeight) / root.scrollHeight) * 100 + '%';
        }, 500);
    }
    progress();

    init();
})()
