var $ = function() {
    return document.querySelectorAll(arguments[0]);
};

var Event = {
    on: function(el, eventName, handler) {
        el && el.addEventListener(eventName, handler);
    },

    off: function(el, eventName, handler) {
        el && el.removeEventListener(eventName, handler);
    }
};