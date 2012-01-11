// see README.md
(function($) {
    var M = {
        init: function(options) {
            S = $.extend({
                fileext: ['.jpg','.png','.gif'],
                image_size: [0.85, 1.5],
                nav_button: [32, 32],
                wait_img: 'img/wait.gif'
            }, options);

            W = $(window);
            D = $(document);
            body = $('body');
            $(['<div id="sojabox">',
                '<div id="sj-head">',
                    '<div>',
                        '<a href="#"id="sj-show-hide"title="hide head"></a>',
                        '<a href="#"id="sj-original"title="original"></a>',
                        '<p id="sj-alt"></p>',
                        '<a href="#"id="sj-close"title="close"></a>',
                    '</div>',
                '</div>',
                '<div id="sj-body">',
                    '<div id="sj-wait">',
                        '<img src="',
                            S['wait_img'],
                        '"alt="wait"/>',
                    '</div>',
                    '<div id="sj-image"></div>',
                    '<div id="sj-prev"title="prev">',
                        '<a href="#"></a>',
                    '</div>',
                    '<div id="sj-next"title="next">',
                        '<a href="#"></a>',
                    '</div>',
                '</div>',
                '<div id="sj-bottom">',
                    '<a href="http://haengebruegge.de"id="sj-copyright">haengebruegge.de</a>',
                '</div>',
            '</div>'].join('')).appendTo(body);
            sj = $('#sojabox');
            sj_head = sj.children('#sj-head');
            sj_body = sj.children('#sj-body');
            sj_image = sj_body.children('#sj-image');
            sj_wait = sj_body.children('#sj-wait');
            sj_original = sj_head.find('#sj-original');
            sj_alt = sj_head.find('#sj-alt');
            sj_group = $obj.find('a.sojabox');
            img_size = [0, 0];

            return $obj.each(function() {
                sj_group.unbind('click').bind('click', function(e) {
                    e.preventDefault();
                    M.open($(this));
                    return false;
                });
                W.resize(function() {
                    if(sj.css('display') == 'block') {
                        M.resize(sj_image.children('img'));
                        M.set_view_position(sj_wait);
                        M.set_view_position(sj_image);
                        M.set_box_size();
                        M.set_nav_position();
                    };
                    return true;
                });
            });
        },
        open: function(target) {
            M.group(target);

            for(var i = 0; i < S['fileext'].length; i++) {
                href = target.attr('href');
                if(href.toLowerCase().indexOf(S['fileext'][i]) >= 0) {
                    M.add_image(href,target.children('img').attr('alt'));
                    break;
                };
            };

            body.addClass('body');
            M.set_view_position(sj_wait);
            M.set_box_size();

            sj.css('display', 'block');
            sj_wait.css('visibility', 'visible');
            sj_image.children('img').each(function() {
                $(this).load(function() {
                    M.resize($(this));
                    M.set_view_position(sj_image);
                    sj_wait.css('visibility', 'hidden');
                    sj_image.css('visibility', 'visible');

                    $('#sj-close').unbind('click').bind('click', function() {
                        M.close();
                        return false;
                    });
                    $('#sj-show-hide').unbind('click').bind('click', function() {
                        M.show_hide();
                        return false;
                    });
                });
            });
        },
        group: function(target) {
            if(sj_group.length >= 2) {
                sj_prev = sj_body.children('#sj-prev');
                sj_next = sj_body.children('#sj-next');
                active = $(target[0]).index();
                prev = active - 1;
                next = active + 1;

                M.set_nav_position();

                sj_prev.children('a').unbind('click').bind(
                    'click', function() {
                    M.prev(prev);
                    return false;
                });
                sj_next.children('a').unbind('click').bind(
                    'click', function() {
                    M.next(next);
                    return false;
                });
            };
        },
        show_hide: function() {
            var alt = sj_head.find('#sj-alt'),
                panel = sj_head.find('#sj-show-hide');
            if(sj_head.hasClass('hide')) {
                sj_original.css('display', 'block');
                alt.css('display', 'block');
                panel.attr('title', 'hide head');
                sj_head.removeClass('hide')
            } else {
                sj_original.css('display', 'none');
                alt.css('display', 'none');
                panel.attr('title', 'show head');
                sj_head.addClass('hide');
            };
        },
        add_image: function(href, alt) {
            sj_image.children('img').detach();
            sj_original.attr('href', href);
            sj_image.append('<img src="'+href+'"/>');
            sj_alt.text(alt);
        },
        change: function(step) {
            sj_image.css('visibility', 'hidden');
            sj_wait.css('visibility', 'visible');
            M.add_image(
                $(sj_group[step]).attr('href'),
                $(sj_group[step]).children('img').attr('alt')
            );
            sj_image.children('img').load(function() {
                M.resize(sj_image.children('img'));
                M.set_view_position(sj_image);
                sj_wait.css('visibility', 'hidden');
                sj_image.css('visibility', 'visible');
            });

            img_size = [0, 0];
        },
        prev: function(step) {
            if(prev >= 0) {
                M.change(step);
                active -= 1;
                prev -= 1;
                next -= 1;
            } else {
                active = sj_group.length -1;
                prev = sj_group.length -2;
                next = sj_group.length;
                M.change(active);
            };
        },
        next: function(step) {
            if(next <= sj_group.length - 1) {
                active += 1;
                prev += 1;
                next += 1;
                M.change(step);
            } else {
                active = 0;
                prev =- 1;
                next = 1;
                M.change(active);
            };
        },
        resize: function(img) {
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
        },
        set_box_size: function() {
            sj.css({ 'width': W.width(), 'height': D.height() });
        },
        set_view_position: function(view) {
            view.css({
                'left': (W.width() / 2) - (view.width() / 2) + W.scrollLeft(),
                'top': (W.height() / 2) - (view.height() / 2) + W.scrollTop()
            });
        },
        set_nav_position: function() {
            if(sj_group) {
                var half_win_height = W.height() / 2,
                    top_pos = (half_win_height - S['nav_button'][1])
                              + W.scrollTop();

                sj_prev.css('top', top_pos);
                sj_next.css({
                    'top': top_pos,
                    'left': (W.width() - S['nav_button'][0]) + W.scrollLeft()
                });
            };
        },
        close: function() {
            img_size = [0, 0];
            sj.css('display', 'none');
            sj_image.css('visibility', 'hidden');
            sj_wait.css('visibility', 'hidden');
            sj_image.children('img').detach();
            sj_alt.text('');
            body.removeClass('body');
        }
    };

    $.fn.sojabox = function(m) {
        $obj = this;
        if(M[m]) {
            return M[m].apply($obj,Array.prototype.slice.call(arguments, 1));
        } else if (typeof m === 'object' || !m) {
            return M.init.apply($obj, arguments);
        } else {
            $.error('Method ' + m + ' does not exist on jQuery.sojabox');
        }
    };
})( jQuery );