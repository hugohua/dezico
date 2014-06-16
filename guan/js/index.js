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
            if ($win.scrollTop() > 1000) {
                if(navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod')
                {
                    $nav.addClass('mod_top_static');
                }else{
                    $nav.addClass('mod_top_fixed');
                }
            }else{
                if(navigator.platform == 'iPad' || navigator.platform == 'iPhone' || navigator.platform == 'iPod')
                {
                    $nav.removeClass('mod_top_static');
                }else{
                    $nav.removeClass('mod_top_fixed');
                }
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
});