/*global $, mixitup, ProgressBar*/


$(function () {
    "use strict";

    var $window = $(window);

    /* start remove loading */

    $("#loading").animate({
        top: '-100%'
    }, 1000, function () {
        $(this).remove();
    });

    /* end remove loading */
    
    /* start layout*/

    var $layOut = $("#layout"),
        $arr = $layOut.text().split(""),
        x,
        q = 0;
        
    $layOut.text(""); // reset paragraph text
        
    for (x = 0; x < $arr.length; x += 1) {
        ($layOut).append("<span>" + $arr[x] + "</span>");
    }
        
    function layout() {
        var $spans = $("#layout > span");
        $spans.eq(q).addClass("left").siblings().removeClass("left");
        q += 1;
        if (q === $arr.length) {
            q = 0;
        }
    }
    
    setInterval(layout, 300); //fire layout function

    /*end layout*/

    /* start coutTo plugin 

    var isCounted = false;
    function countTo() {
        if (!isCounted && $window.scrollTop() >= ($("#statistics").offset().top - ($window.height() / 2))) {
            $('.timer').countTo();
            isCounted = true;
        }
    }

    countTo();

    $window.scroll(function () {
        countTo();
    });

    /* end coutTo plugin */

    /* start mixItUp */

    $(".btn-group > button").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
    });

    var mixer = mixitup('#container', {
        animation: {
            duration: 300
        }
    });

  
    /* end mixItUp */

    /* start skills section */

    /* bars skills part */


    var bars = $(".bars"),
        barsCreated = false;

    function createBars($id, $value) {
        var bar = new ProgressBar.Line($id, {
            strokeWidth: 1,
            easing: 'easeInOut',
            duration: 1400,
            color: '#333',
            trailColor: '#CCC',
            trailWidth: 1,
            svgStyle: {width: '100%', height: '100%'},
            text: {
                style: {
                    color: 'rgb(70, 68, 68)',
                    position: 'absolute',
                    right: (1 - $value) * 100 + '%',
                    top: '-20px',
                    padding: 0,
                    margin: 0,
                    transform: null
                },
                autoStyleContainer: false
            },
            step: (state, bar) => {
                bar.setText(Math.round(bar.value() * 100) + ' %');
                }
            });
            bar.animate($value);
        
    }

/*    function goBars() {
        if (!barsCreated && $window.scrollTop() >= ($("#bars").offset().top - $window.height() / 1.5)) {
            bars.each(function () {
                var barx = $(this).data("value"),
                    id = '#' + $(this).attr("id");
                createBars(id, barx);
            });
            barsCreated = true;
        }
    }

    goBars();
    $window.scroll(function () {
        goBars();
    });


    /* circles skills part */

    var circlesCreated = false,
        $circles = $(".circles");
    function createCircles($id, $value) {

        var bar = new ProgressBar.Circle($id, {
            strokeWidth: 3,
            trailWidth: 3,
            trailColor: '#CCC',
            easing: 'easeInOut',
            duration: 1400,
            text: {
            autoStyleContainer: false
            },
            from: { color: '#333', width: 3 },
            to: { color: '#333', width: 3 },
            step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);
        
            var value = Math.round(circle.value() * 100) + '%';
            if (value === 0) {
                circle.setText('');
            } else {
                circle.setText(value);
            }
        
            }
        });
        bar.text.style.fontSize = '1.2rem';
        
        bar.animate($value);  // Number from 0.0 to 1.
    }

 /*   function goCircles() {
        if (!circlesCreated && $window.scrollTop() >= ($("#circles").offset().top - $window.height() / 1.5)){
            $circles.each(function () {
                var circlex = $(this).data("value"),
                    id = '#' + $(this).attr("id");
                createCircles(id, circlex);
            });
            circlesCreated = true;
        }
    }
    goCircles();
    $window.scroll(function () {
        goCircles();
    });

    /* end skills section */

    /* start smooth scroll 

    var navItems = $(".nav-item"),
        toTop = $(".toTop");

    navItems.click(function (e) {
        e.preventDefault();
        var hash = $(this).children("a").attr('href');
        $("html, body").animate({
            scrollTop: $(hash).offset().top - 50
        }, 1000, navItemsChoose());
        
    });
    var navItem = $("li.nav-item");
    function navItemsChoose() {
        navItem.each(function () {
            var hash = $(this).children("a").attr('href');
            if ($window.scrollTop() >= $(hash).offset().top - 70) {
                $(this).addClass("active").siblings().removeClass("active");
            }
            $(this).click(function () {
                if ($window.outerWidth() < 992) {
                    $(".navbar-toggler").click();
                }
            });
        });
    }
    $window.scroll(function () {
        navItemsChoose();

        if ($window.scrollTop() > 1200) {
            toTop.fadeIn();
        } else {
            toTop.fadeOut();
        }
    });
    navItemsChoose();

    /* end smooth scroll */

});













