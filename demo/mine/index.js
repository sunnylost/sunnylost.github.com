var Mine = (function() {
    var elem;

    var init = function(el) {
        elem = el;
        generateCells();
        generateMines();
    };

    var generateCells = function() {

    };

    return {
        init : init
    };
}());

var field = $('.field')[0],
    grade = $('#grade')[0];