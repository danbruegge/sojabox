// see README.md
(function($) {
    $.fn.sojabox = function(s) {
        var $obj = this,
        W = $(window),
        D = $(document),
        body = $('body'),
        S,sj,sj_head,sj_body,sj_image,sj_wait,sj_original,sj_alt,
        images = $obj.find('a'),
        img_size = [0, 0],
        S = $.extend({
            fileext: ['.jpg','.png','.gif'],
            image_size: [0.85, 1.5],
            nav_button: [32, 32],
            wait_img: 'img/wait.gif'
        }, s);

        /** sojabox TEMPLATE
            <div id="sojabox">
                <div id="soja-head">
                    <div>
                        <a href="#"id="soja-show-hide"title="hide head"></a>
                        <a href="#"id="soja-original"title="original"></a>
                        <p id="soja-alt"></p>
                        <a href="#"id="soja-close"title="close"></a>
                    </div>
                </div>
                <div id="soja-body">
                    <div id="soja-wait">
                        <img src="'+S['wait_img']+'"alt="wait" />
                    </div>
                    <div id="soja-image"><a href="#"title="show original"></a></div>
                    <div id="soja-prev"title="prev"><a href="#"></a></div>
                    <div id="soja-next"title="next"><a href="#"></a></div>
                </div>
                <div id="soja-bottom">
                    <a href="http://haengebruegge.de"id="soja-copyright">haengebruegge.de</a>
                </div>
            </div>
        */
        function _open(target) {
            //~ init ui START =================================================
            $('<div id="sojabox"><div id="sj-head"><div><a href="#"id="sj-panel"title="hide panel"></a><a href="#"id="sj-original"title="original"></a><p id="sj-alt"></p><a href="#"id="sj-close"title="close"></a></div></div><div id="sj-body"><div id="sj-wait"><img src="'+S['wait_img']+'"alt="wait"/></div><div id="sj-image"></div><div id="sj-prev"title="prev"><a href="#"></a></div><div id="sj-next"title="next"><a href="#"></a></div></div><div id="sj-bottom"><a href="http://haengebruegge.de"id="sj-copyright">haengebruegge.de</a></div></div>').appendTo(body);
            body.addClass('body');

            sj = $('#sojabox');
            sj_head = sj.children('#sj-head');
            sj_body = sj.children('#sj-body');
            sj_image = sj_body.children('#sj-image');
            sj_wait = sj_body.children('#sj-wait');
            sj_original = sj_head.find('#sj-original');
            sj_alt = sj_head.find('#sj-alt');

            _reposition(sj_wait);
            _resize_box();

            sj.css('display', 'block');
            sj_wait.css('visibility', 'visible');
            //~ init ui END ===================================================

            //~ grouping START ================================================
            if(images.length >= 2) {
                sj_prev = sj_body.children('#sj-prev');
                sj_next = sj_body.children('#sj-next');
                active = $(target[0]).index();
                prev = active - 1;
                next = active + 1;

                _navigation();

                sj_prev.children('a').unbind('click').bind(
                    'click', function() {
                    _prev(prev);
                    return false;
                });
                sj_next.children('a').unbind('click').bind(
                    'click', function() {
                    _next(next);
                    return false;
                });
            };
            //~ grouping END ==================================================

            for(var i = 0; i < S['fileext'].length; i++) {
                href = target.attr('href');
                if(href.toLowerCase().indexOf(S['fileext'][i]) >= 0) {
                    _add_image(href,target.children('img').attr('alt'));
                    break;
                };
            };

            sj_image.children('img').each(function() {
                $(this).load(function() {
                    _resize($(this));
                    _reposition(sj_image);
                    sj_wait.css('visibility', 'hidden');
                    sj_image.css('visibility', 'visible');

                    $('#sj-close').unbind('click').bind('click', function() {
                        //~ ---------------------------------------------------
                        //~ close the sojabox and try to destroy all
                        //~ ---------------------------------------------------
                        img_size = [0, 0];
                        sj.css('display', 'none');
                        sj_image.css('visibility', 'hidden');
                        sj_wait.css('visibility', 'hidden');
                        sj_image.children('img').detach();
                        sj_alt.text('');
                        body.removeClass('body');
                        sj_prev.css('top', '0');
                        sj_next.css('top', '0');
                        return false;
                    });
                    $('#sj-panel').unbind('click').bind('click', function() {
                        //~ ---------------------------------------------------
                        //~ hide panel when it is displayed or show if it is
                        //~ hidden
                        //~ ---------------------------------------------------
                        var alt = sj_head.find('#sj-alt'),
                            panel = sj_head.find('#sj-show-hide');
                        if(sj_head.hasClass('hide')) {
                            sj_original.css('display', 'block');
                            alt.css('display', 'block');
                            panel.attr('title', 'hide panel');
                            sj_head.removeClass('hide')
                        } else {
                            sj_original.css('display', 'none');
                            alt.css('display', 'none');
                            panel.attr('title', 'show panel');
                            sj_head.addClass('hide');
                        };
                        return false;
                    });
                });
            });
        };

        function _add_image(href, alt) {
            sj_image.children('img').detach();
            sj_original.attr('href', href);
            sj_image.append('<img src="'+href+'"/>');
            sj_alt.text(alt);
        };

        function _change(step) {
            sj_image.css('visibility', 'hidden');
            sj_wait.css('visibility', 'visible');
            _add_image(
                $(images[step]).attr('href'),
                $(images[step]).children('img').attr('alt')
            );
            sj_image.children('img').load(function() {
                _resize(sj_image.children('img'));
                _reposition(sj_image);
                sj_wait.css('visibility', 'hidden');
                sj_image.css('visibility', 'visible');
            });

            img_size = [0, 0];
        };

        function _prev(step) {
            if(prev >= 0) {
                _change(step);
                active -= 1;
                prev -= 1;
                next -= 1;
            } else {
                active = images.length -1;
                prev = images.length -2;
                next = images.length;
                _change(active);
            };
        };

        function _next(step) {
            if(next <= images.length - 1) {
                active += 1;
                prev += 1;
                next += 1;
                _change(step);
            } else {
                active = 0;
                prev =- 1;
                next = 1;
                _change(active);
            };
        };

        function _resize(img) {
            if(img_size[0] == 0 && img_size[1] == 0) {
                img_size[0] = img.width();
                img_size[1] = img.height();
            };

            win_height = W.height();
            win_width = W.width();
            if(img_size[1] >= win_height) {
                img.css('height', win_height * S['image_size'][0]);
            } else if(img_size[0] >= win_width) {
                img.css('width', win_width*S['image_size'][1]);
            };
        };

        function _resize_box() {
            sj.css({ 'width': W.width(), 'height': D.height() });
        };

        function _reposition(view) {
            view.css({
                'left': (W.width() / 2) - (view.width() / 2) + W.scrollLeft(),
                'top': (W.height() / 2) - (view.height() / 2) + W.scrollTop()
            });
        };

        function _navigation() {
            if(images) {
                var half_win_height = W.height() / 2,
                    top_pos = (half_win_height - S['nav_button'][1])
                               + W.scrollTop();

                sj_prev.css('top', top_pos);
                sj_next.css({
                    'top': top_pos,
                    'left': (W.width() - S['nav_button'][0]) + W.scrollLeft()
                });
            };
        };

        return $obj.each(function() {
            images.unbind('click').bind('click', function(e) {
                e.preventDefault();
                _open($(this));
                return false;
            });
            W.resize(function() {
                if(sj.css('display') == 'block') {
                    _resize(sj_image.children('img'));
                    _reposition(sj_wait);
                    _reposition(sj_image);
                    _resize_box();
                    _navigation();
                };
                return true;
            });
        });
    };
})( jQuery );