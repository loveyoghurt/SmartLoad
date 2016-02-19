/**
 * Created by xc on 2015-12-23.
 */
/**
 * Zepto smartLoad Plugin
 */

;(function($){
    $.fn.smartLoad = function(settings){
        var _this = $(this),
            _winScrollTop = 0,
            _winHeight = $(window).height();
        /**
         * @param type 加载策略类型。  scroll:滚动加载；sync:同步加载，同一时间只加载一个资源
         */
        settings = $.extend({
            threshold: 0,
            placeholder: 'data:image/png;base64,iVBORw0',
            type: 'scroll'
        }, settings||{});

        if(settings.type == 'scroll'){
            $(window).on('scroll',function(){
                scrollLoad();
            });
        }
        else if(settings.type == 'sync'){
            syncLoad(_this, 0, settings.callback);
        }

        // 按需（滚动到视窗内）加载
        function scrollLoad(){
            _winScrollTop = $(window).scrollTop();
            _this.each(function(){
                var _self = $(this);
                // img对象
                if(_self.is('img')){
                    if(_self.attr('data-original')){
                        var _offsetTop = _self.offset().top;
                        //滚到视窗内的图片开始加载
                        if((_offsetTop - settings.threshold) <= (_winHeight + _winScrollTop)){
                            _self.attr('src',_self.attr('data-original'));
                            _self.removeAttr('data-original');
                        }
                    }
                    // 非img元素，用background-image方式显示
                }else{
                    if(_self.attr('data-original')){
                        // é»˜è®¤å ä½å›¾ç‰‡
                        if(_self.css('background-image') == 'none'){
                            _self.css('background-image','url('+settings.placeholder+')');
                        }
                        var _offsetTop = _self.offset().top;
                        if((_offsetTop - settings.threshold) <= (_winHeight + _winScrollTop)){
                            _self.css('background-image','url('+_self.attr('data-original')+')');
                            _self.removeAttr('data-original');
                        }
                    }
                }
            });
        }
        //同步加载，同一时间只加载一个资源
        function syncLoad(queue, index, callback){
            if(queue.length){
                var item = $(queue[index]);
                if(item.attr('data-original')){
                    item.attr('src', item.attr('data-original'));
                    item.on('load', function(){
                        //执行回调，把当前元素传参给回调方法
                        if(typeof callback === 'function'){
                            callback.apply(this, item);
                        }
                        if(index < queue.length - 1){
                            syncLoad(queue, index + 1, callback);
                        }
                    });
                }
            }
        }
    }
})(Zepto);