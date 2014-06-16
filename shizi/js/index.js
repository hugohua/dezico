/**
 * jQuery.timers - Timer abstractions for jQuery
 * Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
 * Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
 * Date: 2009/02/08
 *
 * @author Blair Mitchelmore
 * @version 1.1.2
 *
 **/

jQuery.fn.extend({
    everyTime: function(interval, label, fn, times, belay) {
        return this.each(function() {
            jQuery.timer.add(this, interval, label, fn, times, belay);
        });
    },
    oneTime: function(interval, label, fn) {
        return this.each(function() {
            jQuery.timer.add(this, interval, label, fn, 1);
        });
    },
    stopTime: function(label, fn) {
        return this.each(function() {
            jQuery.timer.remove(this, label, fn);
        });
    }
});

jQuery.event.special

jQuery.extend({
    timer: {
        global: [],
        guid: 1,
        dataKey: "jQuery.timer",
        regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,
        powers: {
            // Yeah this is major overkill...
            'ms': 1,
            'cs': 10,
            'ds': 100,
            's': 1000,
            'das': 10000,
            'hs': 100000,
            'ks': 1000000
        },
        timeParse: function(value) {
            if (value == undefined || value == null)
                return null;
            var result = this.regex.exec(jQuery.trim(value.toString()));
            if (result[2]) {
                var num = parseFloat(result[1]);
                var mult = this.powers[result[2]] || 1;
                return num * mult;
            } else {
                return value;
            }
        },
        add: function(element, interval, label, fn, times, belay) {
            var counter = 0;

            if (jQuery.isFunction(label)) {
                if (!times)
                    times = fn;
                fn = label;
                label = interval;
            }

            interval = jQuery.timer.timeParse(interval);

            if (typeof interval != 'number' || isNaN(interval) || interval <= 0)
                return;

            if (times && times.constructor != Number) {
                belay = !!times;
                times = 0;
            }

            times = times || 0;
            belay = belay || false;

            var timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {});

            if (!timers[label])
                timers[label] = {};

            fn.timerID = fn.timerID || this.guid++;

            var handler = function() {
                if (belay && this.inProgress)
                    return;
                this.inProgress = true;
                if ((++counter > times && times !== 0) || fn.call(element, counter) === false)
                    jQuery.timer.remove(element, label, fn);
                this.inProgress = false;
            };

            handler.timerID = fn.timerID;

            if (!timers[label][fn.timerID])
                timers[label][fn.timerID] = window.setInterval(handler,interval);

            this.global.push( element );

        },
        remove: function(element, label, fn) {
            var timers = jQuery.data(element, this.dataKey), ret;

            if ( timers ) {

                if (!label) {
                    for ( label in timers )
                        this.remove(element, label, fn);
                } else if ( timers[label] ) {
                    if ( fn ) {
                        if ( fn.timerID ) {
                            window.clearInterval(timers[label][fn.timerID]);
                            delete timers[label][fn.timerID];
                        }
                    } else {
                        for ( var fn in timers[label] ) {
                            window.clearInterval(timers[label][fn]);
                            delete timers[label][fn];
                        }
                    }

                    for ( ret in timers[label] ) break;
                    if ( !ret ) {
                        ret = null;
                        delete timers[label];
                    }
                }

                for ( ret in timers ) break;
                if ( !ret )
                    jQuery.removeData(element, this.dataKey);
            }
        }
    }
});

jQuery(window).bind("unload", function() {
    jQuery.each(jQuery.timer.global, function(index, item) {
        jQuery.timer.remove(item);
    });
});


/**
 * Created by admin on 14-4-13.
 */
$(function(){
    var $win = $(window),
        $nav = $('#J_top');
    window.raF = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    //初始化效果插件
    setTimeout(function() {
        var s = skrollr.init({
            forceHeight: false
        });

        skrollr.menu.init(s,{
            animate: true
        });
    }, 500);

    //滚动
    $win.on('scroll',function(){
        raF(function(){
            if ($win.scrollTop() > 760) {
                if(navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod')
                {
                    $nav.addClass('nav_static');
                }else{
                    $nav.addClass('nav_fixed');
                }
            }else{
                if(navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod')
                {
                    $nav.removeClass('nav_static');
                }else{
                    $nav.removeClass('nav_fixed');
                }
                $nav.removeClass('nav_fixed');
            }
//            console.info('a',$win.scrollTop())
        });
    });

    //点击添加高亮
    $nav.find('a').on('click',function(){
        $nav.find('a').removeClass('selected');
        $(this).addClass('selected');
    });
    $('#J_top_nav').find('a').click(function(){
        var href = $(this).attr('href');
        $nav.find('a[href="'+ href +'"]').addClass('selected');
    });
    //页面载入时，如果有hash，则高亮
    window.location.hash && $nav.find('a[href="'+ window.location.hash +'"]').addClass('selected');

    var ani = function(){
        $('#J_ani5').animate({
            left:'1600px',
            top:'-230px',
            opacity:0
        },15000,function(){
            $('#J_ani5').css({top: '127px', left: '187px',opacity:1})
        });
        $('#J_ani6').animate({
            left:'-1600px',
            top:'-230px',
            opacity:0
        },15000,function(){
            $('#J_ani6').css({top:'135px',left:'903px',opacity:1})
        });
    }
    ani();
    //头部小动画
    setInterval(function(){
        ani();
    },15000)

    $("#J_ani1").everyTime(10, function(){
        $("#J_ani1").animate({top:"239px"}, 2000).animate({top:"269px"}, 1200);
    });
    
    $('#J_cnt1').click(function(){
        $(this).find('iframe').show();
    })

});