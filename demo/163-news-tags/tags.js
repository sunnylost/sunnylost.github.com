function find(selector) {
    return document.querySelectorAll(selector);
}

/*
    将数组打乱顺序
*/
function shuffle(arr) {
    var len = arr.length,
        a = [];
    arr = arr.slice(0);
    while(len--) {
        a.push(arr.splice(parseInt(len * Math.random()), 1)[0]);
    }
    return a;
}



var layout = [
        //#1
        [{
            direction: 'v',
            color: 0,
            box: [
                [ 0.5, 0.33 ],
                [ 0.5, 0.33 ]
            ]
        }, {
            direction: 'h',
            width: 0.5,
            multiple: true,
            box: [{
                direction: 'v',
                color: 0,
                box: [
                    [ 0.13, 0.1 ],
                    [ 0.13, 0.1 ],
                    [ 0.13, 0.12 ]
                ]
            }, {
                direction: 'v',
                color: 0,
                box: [
                    [ 0.13, 0.1 ],
                    [ 0.13, 0.1 ],
                    [ 0.13, 0.12 ]
                ]
            }, {
                direction: 'v',
                color: 0,
                box: [
                    [ 0.15, 0.32 ]
                ]
            }, {
                direction: 'v',
                color: 0,
                box: [
                    [ 0.09, 0.18 ],
                    [ 0.09, 0.14 ]
                ]
            }]
        }],
        //#2
        [{
            direction: 'v',
            color: 1,
            width: 0.25,
            box: [
                [ 0.25, 0.18 ],
                [ 0.25, 0.18 ]
            ]
        }, {
            direction: 'v',
            width: 0.25,
            multiple: true,
            box: [{
                direction: 'h',
                color: 1,
                box: [
                    [ 0.25, 0.11 ]
                ]
            }, {
                direction: 'h',
                color: 1,
                box: [
                    [ 0.13, 0.13 ],
                    [ 0.12, 0.13 ]
                ]
            }, {
                direction: 'h',
                color: 1,
                box: [
                    [ 0.14, 0.12 ],
                    [ 0.11, 0.12 ]
                ]
            }]
        }],
        //#3
        [{
            direction: 'v',
            color: 2,
            width: 0.32,
            box: [
                [ 0.15, 0.32 ]
            ]
        }, {
            direction: 'v',
            width: 0.2,
            multiple: true,
            box: [{
                direction: 'h',
                color: 2,
                box: [
                    [ 0.09, 0.16 ],
                    [ 0.11, 0.16 ]
                ]
            }, {
                direction: 'h',
                color: 2,
                maxHeight: 0.16,
                box: [
                    [ 0.065, 0.16 ],
                    [ 0.065, 0.16 ],
                    [ 0.07, 0.16 ]
                ]
            }]
        }, {
            direction: 'v',
            width: 0.3,
            multiple: true,
            box: [{
                direction: 'h',
                color: 2,
                box: [
                    [ 0.09, 0.18 ],
                    [ 0.06, 0.18 ]
                ]
            }, {
                direction: 'h',
                color: 2,
                box: [
                    [ 0.15, 0.14 ]
                ]
            }]
        }],
        //#4
        [{
            direction: 'v',
            color: 3,
            width: 0.25,
            box: [
                [ 0.08, 0.15 ],
                [ 0.08, 0.15 ]
            ]
        }, {
            direction: 'h',
            multiple: true,
            width: 0.25,
            box: [{
                direction: 'v',
                color: 3,
                box: [
                    [ 0.08, 0.15 ],
                    [ 0.08, 0.15 ]
                ]
            }, {
                direction: 'v',
                color: 3,
                box: [
                    [ 0.08, 0.15 ],
                    [ 0.08, 0.15 ]
                ]
            }, {
                direction: 'v',
                color: 3,
                box: [
                    [ 0.15, 0.3 ]
                ]
            }, {
                direction: 'v',
                color: 3,
                box: [
                    [ 0.11, 0.1 ],
                    [ 0.11, 0.1 ],
                    [ 0.11, 0.1 ]
                ]
            }]
        }]
    ];

(function() {
    var gap = 0.001,
        topGap = 0.005,
        div = document.createElement('div'),
        stage = find('.stage')[0],
        colors = [
            ['#E37063', '#CE5F52'],
            ['#6C5D56', '#746760'],
            ['#DBC877', '#C8B66A'],
            ['#82A8BF', '#6E96B1']
        ],
        pos,
        top = 0,
        left = 0,
        tags = [];

    function build(flag) {
        var isAnotherSide = false;
        top = left = 0;
        pos = [];
        layout.forEach(function(v, i) {
            if(i == 1) {
                top = 0;
                isAnotherSide = true;
            }
            if(isAnotherSide) {
                left = 0.5;
            }
            v.forEach(function(v, i) {
                compose(v, null, 0);
            })
        });
        render(flag);
    }
    build(true);


    function compose(v, width, level) {
        var box = shuffle(v.box),
            color = v.color,
            d = v.direction,
            width = width || v.width,
            w = 0, h = 0,
            curTop = top,
            curLeft = left;

        if(!Array.isArray(box[0])) {
            box.forEach(function(v) {
                compose(v, width, 1);
            })
        } else {
            box.forEach(function(v) {
                pos.push({
                    w: v[0] - gap,
                    h: v[1] - topGap,
                    t: curTop + topGap,
                    l: curLeft + gap,
                    c: color
                });

                if(d == 'v') {
                    w = v[0];
                    h += v[1];
                    curTop += v[1];
                } else {
                    w += v[0];
                    h = v[1];
                    curLeft += v[0];
                }
            });
            if(d == 'v') {
                if(w < 0.5) {
                    if(left + w <= 1) {
                        left += w;
                    }
                } else {
                    top += h;
                    left = 0;
                }
            } else {
                top += h;
            }
        }
        if(level == 0 && d == 'v' && v.multiple) {
            left += width;
            if(left < 1) {
                top = curTop;
            }
        }
    }

    function render(flag) {
        var i = 0,
            len = pos.length,
            p,
            point,
            w = stage.offsetWidth,
            h = stage.offsetHeight,
            width, height,
            top, left,
            div = document.createElement('div'),
            tag;
        for(; i < len; i++) {
            p = pos[i];
            if(flag) {
                tag = div.cloneNode(false);
                tag.className = 'tag';
                stage.appendChild(tag);
                tags.push(tag);
            } else {
                tag = tags[i];
                tag.className = 'tmpTag';
            }
            width = p.w * w;
            height = p.h * h;
            top = p.t * h;
            left = p.l * w;
            tag.style.cssText = 'width:' + width +
                                'px;height:' + height +
                                'px;line-height:' + height +
                                'px;top:' + Math.random() * 5 * height +
                                'px;left:' + Math.random() * 5 * width +
                                'px;font-size:' + p.h * h / 2 +
                                'px;background-color:' + colors[p.c][parseInt(Math.random() * 2)];
            tag.$pos = [top, left];
            tag.innerHTML = 'test';
        }
        setTimeout(setRealPos, 200);
    }

    function setRealPos() {
        var i = 0,
            count,
            len = tags.length,
            pos,
            tag;
        for(; i < len; i++) {
            tag = tags[i];
            tag.className = 'tag';
            pos = tag.$pos;
            tag.style.top = pos[0] + 'px';
            tag.style.left = pos[1] + 'px';
        }
    }

    var refresher = find('.refresh a')[0],
        isRotating = false;
        degree = 0,
        globalID = 0;
    refresher.addEventListener('click', function() {
        if(!isRotating) {
            isRotating = true;
            build();
            this.style.cssText = '-webkit-transform: rotate(' + (degree += 360) + 'deg);' +
                                 '-moz-transform: rotate(' + degree + 'deg);' +
                                 'transform: rotate(' + degree + 'deg);'
        };
    }, false);

    refresher.addEventListener('webkitTransitionEnd', function() {
        isRotating = false;
    });
    refresher.addEventListener('transitionend', function() {
        isRotating = false;
    });

    window.onresize = function() {
        clearTimeout(globalID);
        globalID = setTimeout(build, 100);
    };

    function moveOut(d) {
        var offsetWidth = stage.offsetWidth,
            destOffset = (d == 'r' ? -1 : 1) * offsetWidth,
            top, left,
            count = tags.length,
            tag;

        for(var i = 0, len = count; i < len; i++) {
            tag = tags[i];
            top = parseInt(tag.style.top);
            left = parseInt(tag.style.left);
            tag.$info = [ left, -2 * destOffset ];
            setTimeout(function(el, left) {
                return function() {
                    el.style.left = destOffset + left + 'px';
                    count--;
                    !count && setTimeout(restore, 600);
                }
            }(tag, left), parseInt(500 * Math.random()) + 100);
        }
    }

    function restore() {
        var tag,
            info;
        for(var i = 0, len = tags.length; i < len; i++) {
            tag = tags[i];
            info = tag.$info;
            tag.className = 'tmpTag';
            tag.style.left = parseInt(tag.style.left) + info[1] + 'px';
            setTimeout(function(el, left) {
                return function() {
                    el.className = 'tag';
                    el.style.left = left + 'px';
                    el.innerHTML = 'Haha' + parseInt(Math.random() * 100);
                }
            }(tag, info[0]), parseInt(500 * Math.random()) + 100);
        }
    }


    var time = {
        timeSpot: [ '#today', '#threedays', '#week' ],
        curTime: null,
        spot: '.spot',
        direction: null,

        setSpotPos: function(e) {
            var el = e.currentTarget,
                curLeft = parseInt(this.spot.style.left),
                destLeft = el.offsetLeft;
            this.direction = curLeft > destLeft ? 'l' : 'r';
            this.spot.style.left = el.offsetLeft + 'px';
            this.curTime.className = '';
            el.className = 'current';
            this.curTime = el;
            moveOut(this.direction);
            e.preventDefault();
        },

        init: function() {
            var that = this;
            that.spot = find(that.spot)[0];
            that.spot.style.left = '0px';
            that.timeSpot.forEach(function(v, i) {
                if(i == 0) that.curTime = v[0];
                (v = find(v)[0]).addEventListener('click', that.setSpotPos.bind(that));
            })
        }
    }

    time.init();
}())