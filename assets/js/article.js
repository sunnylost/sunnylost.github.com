!function() {
    var doc = document,
        body = doc.body,
        root = doc.getElementsByClassName('content')[0],
        win = window;

    !function() {
        var progressTimeout,
            resizeTimeout,
            progressBar = doc.getElementsByClassName('progress')[0];

        progress();

        root.onscroll = progress;

        win.onresize = function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                progress();
            }, 200);
        };

        win.onload = function() {
            setTimeout(function() {
                body.className = "";    
            }, 1000);
        };

        /*
            Progress Bar
        */
        function progress() {
            clearTimeout(progressTimeout);
            progressTimeout = setTimeout(function() {
                progressBar.style.width = ((root.scrollTop + win.innerHeight) / root.scrollHeight) * 100 + '%';
            }, 500);
        }
    }();
}()