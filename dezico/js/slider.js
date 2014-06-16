/**
 * slider plugin
 * author: aronhuang
 * require: jquery
 * version: 1.0
 * JQ插件模式 TODO: CMD AMD
 * example: $('#demo').slider() or new Slider('#demo')
 */

(function($){
	/**
	 * Class Slider
	 */
	var Slider = function(element, options){
		this.element = $(element);
		this.options = $.extend({}, Slider.defaults, options);
		this._init();
	}


	/**
	 * prototype
	 */
	Slider.prototype = {
		constructor: Slider,

		/**
	     * 效果函数集
	     * TODO: use css3 transition
	     */
		effectFns: {
			none: function(index){
				this.slides.hide().eq(index).show();
			},

			fade: function(index){
				var curIdx = this.index;
				this.slides.eq(curIdx).stop().animate({opacity: 0}, this.speed);
				this.slides.eq(index).stop().animate({opacity: 1}, this.speed);
			},

			scrollX: function(index){
				this.scroller.stop().animate({'left': -index * this.stepWidth}, this.speed);
			},

			scrollY: function(index){
				this.scroller.stop().animate({'top': -index * this.stepWidth}, this.speed);
			}
		},

		/**
	     * 初始化
	     * @private
	     */
		_init: function(){
			var opts = this.options;
			this.scroller = this.element.find(opts.scroller);
			this.slides = this.scroller.children();
			if (this.slides.length < 2) {
				return ;
			}
			this.nav = this.element.find(opts.nav).children();
			this.prevBtn = this.element.find(opts.prevBtn);
			this.nextBtn = this.element.find(opts.nextBtn);
			
	
			this.speed = opts.speed;
			this.autoPlay = opts.autoPlay;
			this.delay = opts.delay;
			this.length = this.slides.length;
			this.maxIndex = this.length - 1;
			this.index = isNaN(opts.index) ? 0 : opts.index;
			this.transition = 'webkitTransition' in document.body.style && opts.useWebkitTransition;
			this._initEffect();
			if (this.autoPlay) {
				this.play();
			}
			if (opts.lazyload) {
				this._loadImg(this.index);
			}
			this._bindEvent();
		},

		/**
	     * 绑定事件
	     * @private
	     */
		_bindEvent: function(){
			

			var opts = this.options, self = this;
			//导航事件
			

			// $(this.prevBtn).click(function(e){

			// 	alert(1)
			// 	//e.preventDefault();
			// 	//self.prev();
			// });

			// this.nav.on(opts.triggerEvent, function(e){
			// 	var index = self.nav.index($(this));
			// 	if (index == self.index) {
			// 		return ;
			// 	}
			// 	self.slideTo(index);
			// });

			//hover事件
			// this.element.on('mouseenter', function(e){
			// 	self.stop();
			// 	self.prevBtn.fadeIn();
			// 	self.nextBtn.fadeIn();
			// }).on('mouseleave', function(e){
			// 	self.play();
			// 	self.prevBtn.fadeOut();
			// 	self.nextBtn.fadeOut();
			// });

					
			//前后按钮




			if($('.slider_btn_prev'))
			{
				$(".slider_btn_prev").on("click",function(e){
					e.preventDefault();
					self.prev();
				})


				$('.slider_btn_next').on('click', function(e){
					e.preventDefault();
					self.next();
				});
			}
			

		},

		/**
	     * 初始化效果样式
	     * @private
	     */
		_initEffect: function(){
			var opts = this.options, effect = opts.effect, slides = this.slides, index = this.index;
			this.effectFn = this.effectFns[effect];
			switch(effect){
				case 'none':
					slides.hide().eq(index).show();
					break ;
				case 'fade':
					slides.css({'opacity': 0, 'position': 'absolute', 'top': 0, 'left': 0}).eq(index).css('opacity', 1);
					break ;
				case 'scrollX':
					this.stepWidth = slides.eq(0).width();
					this.scroller.css({'position': 'absolute', 'width': this.length * this.stepWidth, 'left': -index * this.stepWidth});
					slides.css('float', 'left');
					break ;
				case 'scrollY':
					this.stepWidth = this.slides.eq(0).height();
					this.scroller.css({'position': 'absolute', 'top': -index * this.stepWidth});
					break ;
			}
			this._updateNav();
		},

		/**
	     * 获取当前帧索引
	     * @public
	     * @returns 当前索引
	     */
		getIndex: function(){
			return this.index;
		},

		/**
	     * 播放
	     * @public
	     */
		play: function(){
			var self = this;
			if (!this.timer) {
				this.timer = window.setInterval(function(){
					self.next();
				}, this.delay);
			}
		},

		/**
	     * 暂停
	     * @public
	     */
		stop: function(){
			if (this.timer) {
				window.clearInterval(this.timer);
				this.timer = null;	
			}
		},

		/**
	     * 滚动到指定帧
	     * @public
	     * @prama 帧索引
	     */
		slideTo: function(index){
			var opts = this.options;
			if (index == this.index || index < 0 || index > this.maxIndex) {
				return ;
			}
			this.effectFn(index);
			if(document.getElementById('J_slider'))
			{
				var cls=['bg_friend','bg_im','bg_town'];
				var bg=['#8b64b7','#e95c40','#5cb8e7'];
				document.getElementById('J_slider').style.background=bg[index];
				document.documentElement.className="bg_index "+cls[index];
			}
			this.index = index;
			this._updateNav();
			if (opts.lazyload) {
				this._loadImg(index);
			}
			//预加载下一帧图片
			if (opts.lazyload && opts.preload) {
				index = index == 0 ? this.maxIndex : index == this.maxIndex ? 0 : index;
				this._loadImg(index); 
			}
		},

		/**
	     * 下一帧
	     * @public
	     */
		next: function(){
			var index = this.index + 1;
			if (index > this.maxIndex) {
				index = index % this.length;
			}
			this.slideTo(index);
		},

		/**
	     * 上一帧
	     * @public
	     */
		prev: function(){
			var index = this.index - 1;
			if (index < 0) {
				index = this.maxIndex;
			}
			this.slideTo(index);
		},

		/**
	     * lazyload 图片
	     * @private
	     * TODO: 增加预加载下一帧功能
	     */
		_loadImg: function(index){
			var img = this.scroller.find('img').eq(index), opts = this.options, lazyAttr = opts.lazyload, loadingCls = opts.loadingCls;
			var src = $(img).attr(lazyAttr);
			if (!src) {
				return ;
			}
			img.parent().addClass(loadingCls);
			var imgObj = new Image();
			$(imgObj).on('load', function(e){
				img.attr('src', src).removeAttr(lazyAttr).parent().removeClass(loadingCls);
			});
			imgObj.src = src;
		},

		/**
	     * 更新导航状态
	     * @private
	     */
	    _updateNav: function(){
	    	var index = this.index, curCls = this.options.curCls;
	    	this.nav.eq(index).addClass(curCls).siblings().removeClass(curCls);
	    }
	}


	/**
	 * default options
	 */
	Slider.defaults = {
		scroller: '.slider_ctn',
		nav: '.slider_nav',
		triggerEvent: 'click',
		prevBtn: '.slider_btn_prev',
		nextBtn: '.slider_btn_next',
		curCls: 'on',
		index: 0,
		speed: 500,
		delay: 3000,
		preload: true, //配合lazyload使用，预加载下一帧
		lazyload: 'data-lazy',
		loadingCls: 'slider_loading',
		autoPlay: true,
		effect: 'fade',
		useWebkitTransition: false
	};

	window.Slider = $.Slider = Slider;
	//jquery 插件模式 
	$.fn.slider = function(options) {
		if(this.length == 0) {
			return this;
		}
		var returnValue, args = arguments;
		this.each(function() {
			var instance = $(this).data('_slider');
			//如果第一个参数是String，则调用相应方法,其他参数作为方法的参数，但必须先生成实例
			if(typeof(options) == 'string'){
				//if(!instance){return ;}//实例未生成
				if(instance && typeof(instance[options]) === 'function'){
					args = Array.prototype.slice.call(args, 1 );
					returnValue = instance[options].apply(instance, args);
				}
			}
			//如果参数是配置对象，则生成实例
			else {
				if(!instance){
					instance = new Slider($(this),options);
					$(this).data('_slider', instance);
				}
			}

		});
		//有返回值则返回返回值，无返回值返回调用的jQuery对象，保持jQuery链式调用
		return returnValue === undefined ? this : returnValue;
	}
})(jQuery);


	

