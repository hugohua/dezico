;(function () {
    $.extend( jQuery.easing,
        {
            easeInOutQuint: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                return c/2*((t-=2)*t*t*t*t + 2) + b;
            }
        });
    var $win = $(window),
        isIE6 = ( navigator.userAgent.match(/msie/i) && navigator.userAgent.match(/6/) ),
        ScrollNav = (function () {

            function ScrollNav(element, options) {
                // jquery dom对象
                this.$element = $(element);
                // 插件的参数
                this.settings = $.extend({}, $.fn.scrollnav.defaults, this.$element.data() , typeof options == 'object' && options);
                // 插件的菜单，就是点击滚动的小点
                this.$navItems = this.$element.find(this.settings.cssNavItem);
                // 页面屏数 通过属性data-snav 与之关联
                var cssSlide = this.$element.attr('data-snav');
                cssSlide && ( this.settings.cssSlide = cssSlide );
                // 将所有屏数的坐标值存进数组
                this.offsets = this.getPageOffset();
                // 获取插件目前所在的位置（用于IE6无法使用fiexd的设置）
//                this.top = this.$element.offset().top;
                //判断是否在动画中
                this.isAnimating=false;
                //当前的所在屏数
                this.curIndex = -1;
                //总屏数
                this.total = this.$navItems.length;
                // 初始化
                this.init();
            }

            /**
             * 插件的共有方法
             */
            ScrollNav.prototype = {
                /**
                 * 初始化函数
                 */
                init:function(){
                    // that 表示 ScrollNav 这个类
                    var that = this;
                    //点击事件
                    this.$navItems.bind('click.scrollnav',function(e) {
                        //获取点击所在的屏数
                        var index = that.$navItems.index(this);
                        console.info(index,this)
                        //跳转到相应的屏数
                        that.goTo(index);
                        //阻止元素本身的事件
                        e.preventDefault();
                    });
                    //滚动条事件
                    $win.bind('scroll.scrollnav',function(){
                        //更新频数索引值
                        that.updateSelectedNavIndex();
                        //更新导航菜单选中态
                        that.updateNav(that.curIndex);
                    })
                },

                /**
                 * 跳转到第几屏
                 */
                goTo:function(idx){
                    //已经当前页
                    if (this.curIndex==idx) {
                        return false;
                    };

                    //当前正在动画中
                    if (this.isAnimating) {
                        return false;
                    };
                    var s_top = this.offsets[idx],      // 获取当前屏数的坐标值 s_  实际就是select_ 即选中的
                        that = this;

                    this.curIndex = idx;
                    this.isAnimating = true;
                    //更新导航菜单
                    this.updateNav(idx);
                    //console.log(idx);
                    $("html,body").animate({
                        scrollTop: s_top
                    }, that.settings.duration,that.settings.easing,function(){
                        that.isAnimating = false;
                        that.$element.trigger(that.settings.onNavEventName,[that]);
                    });
                },

                /**
                 * 跳转到下一屏
                 */
                goPrev:function(){
                    var idx = this.curIndex - 1;
                    if (idx<0) {
                        return false;
                    };
                    this.goTo(idx);
                },

                /**
                 * 跳转到上一屏
                 */
                goNext:function(){
                    var idx = this.curIndex + 1;
                    if (idx>=this.total) {
                        return false;
                    };
                    this.goTo(idx);
                },

                /**
                 * 更新导航菜单
                 */
                updateNav:function(index){
                    this.$navItems
                        .removeClass(this.settings.clActive)
                        .eq(index)
                        .addClass(this.settings.clActive);
                },

                /**
                 * 获取所有页面片的偏移量数据
                 */
                getPageOffset : function(){
                    var arr = [];
                    $(this.settings.cssSlide).each(function(i){
                        var $this = $(this),
                            top = $this.offset().top;
                        if(i==0) top = 0;
                        arr.push(top);

                    });
                    return arr;
                },

                /**
                 * 更新屏数索引
                 */
                updateSelectedNavIndex : function(){
                    //如果还在动画中 则不更新
                    if (this.isAnimating) {
                        return false;
                    };

                    var  s_top = $win.scrollTop(), //当前滚动条的位置
                        winHeight = $win.height(),
                        pagerSensitive = this.settings.pagerSensitive||(winHeight/2),
                        idx = 0;

                    for(var i in this.offsets)  {
                        if ( (s_top+winHeight-this.offsets[this.total-i-1]) >= pagerSensitive ) {
                            idx = this.total-i-1;
                            break;
                        };
                    };//for

                    this.curIndex = idx;
                }
            }

            return ScrollNav;
        })();


    /**
     * 定义JQ插件
     */
    $.fn.scrollnav = function (options) {
//        debugger;
        return this.each(function () {
            var $this = $(this),
                data = $this.data('scrollnav');
            if (!data) {
                $this.data('scrollnav', (data = new ScrollNav(this,options)));
                return;
            };
            if (typeof options == 'string'){
                data[options].apply(data[options],Array.prototype.slice.call(args, 1));
            };
        })
    };

    /**
     * 插件的默认值
     */
    $.fn.scrollnav.defaults = {
        cssSlide        : '.page',              //关联的页面
        duration        : 600,                  //滚动速度
        easing          : 'linear',     //滚动效果
        clActive        :'selected',            //选中态类名
        onNavEventName  :'onScrollNav',         //触发的自定义事件
        pagerSensitive  : null,                 //翻页灵敏度。下一页出现多少像素时才切换菜单的curIndex，为null时取值$win.height()/2
        cssNavItem      :'a'                    //导航点击元素
    };


})();
