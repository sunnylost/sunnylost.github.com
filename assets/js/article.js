!function() {
    var doc = document,
        body = doc.body,
        root = doc.getElementsByClassName('content')[0],
        win = window;

    !function() {
        win.onload = function() {
            setTimeout(function() {
                body.className = "";    
            }, 1000);
        };
    }();
}()