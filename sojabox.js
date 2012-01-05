// see README
(function($) {
    $.fn.sojabox = function(m) {
        $obj = this;
        if(M[m]) {
            return M[m].apply(
                this,
                Array.prototype.slice.call(arguments,1)
            );
        } else if (typeof m === 'object' || !m) {
            return M.init.apply(this, arguments);
        } else {
            $.error('Method '+m+' does not exist on jQuery.sojabox');
        }
    };

    var M = {
        init: function(options) {
            S = $.extend({
                extensions: new Array('.jpg','.png','.gif'),
                image_size: new Array(0.85, 1.5),
                nav_button: new Array(32, 32),
                wait_img: 'img/wait.gif'
            }, options);

            W = $(window);
            D = $(document);
            body = $('body');

            $('<div id="sojabox"><div id="soja-head"><div><a href="#"id="soja-show-hide"title="hide head"></a><a href="#"id="soja-original"title="original"></a><p id="soja-alt"></p><a href="#"id="soja-close"title="close"></a></div></div><div id="soja-body"><div id="soja-wait"><img src="'+S['wait_img']+'"alt="wait"/></div><div id="soja-image"></div><div id="soja-prev"title="prev"><a href="#"></a></div><div id="soja-next"title="next"><a href="#"></a></div></div><div id="soja-bottom"><a href="http://haengebruegge.de"id="soja-copyright">haengebruegge.de</a></div></div>').appendTo('body');
            soja = $('#sojabox');
            soja_head = soja.children('#soja-head');
            soja_body = soja.children('#soja-body');
            soja_image = soja_body.children('#soja-image');
            soja_wait = soja_body.children('#soja-wait');
            soja_original = soja_head.find('#soja-original');
            soja_alt = soja_head.find('#soja-alt');

            img_size = new Array(0, 0);

            soja_group_name = null;
            soja_group = $obj.find('a.sojabox');

            return this.each(function(){
                W.resize(function() {
                    M.set_image_size(soja_image.children('img'));
                    M.set_view_position(soja_wait);
                    M.set_view_position(soja_image);
                    M.set_box_size();
                    M.set_nav_position();
                });
                soja_group.unbind('click').bind(
                    'click', function(e) {
                        e.preventDefault();
                        M.open($(this)); return false;
                });
                $('#soja-close').unbind('click').bind('click', function() {
                    M.close(); return false;
                });
                $('#soja-show-hide').unbind('click').bind('click', function() {
                        M.show_hide(); return false;
                });
            });
        },
        open: function(target) {
            body.addClass('body');

            if(soja_group.length >= 2) {
                soja_prev = soja_body.children('#soja-prev');
                soja_next = soja_body.children('#soja-next');

                for(i=0;i<soja_group.length;i++) {
                    if(target[0]==soja_group[i]) { active=i };
                };
                next=active+1;
                prev=active-1;
                //~ soja_group[prev], soja_group[active], soja_group[next]
                M.set_nav_position();

                soja_prev.children('a').unbind('click').bind(
                    'click', function() {
                    M.prev(prev); return false;
                });

                soja_next.children('a').unbind('click').bind(
                    'click', function() {
                    M.next(next); return false;
                });
            };

            for(key in S['extensions']) {
                href = target.attr('href');
                if(href.toLowerCase().indexOf(S['extensions'][key]) >= 0) {
                    M.add_image(href,target.children('img').attr('alt'));
                    break;
                };
            };

            M.set_view_position(soja_wait);
            M.set_box_size();
            soja.css('display', 'block');

            soja_wait.css('visibility', 'visible');
            soja_image.children('img').each(function() {
                $(this).load(function() {
                    M.set_image_size($(this));
                    M.set_view_position(soja_image);
                    soja_wait.css('visibility', 'hidden');
                    soja_image.css('visibility', 'visible');
                });
            });
        },
        close: function() {
            img_size[0] = 0;
            img_size[1] = 0;
            soja.css('display', 'none');
            soja_image.css('visibility', 'hidden');
            soja_wait.css('visibility', 'hidden');
            soja_image.children('img').detach();
            soja_alt.text('');
            body.removeClass('body');
        },
        show_hide: function() {
            var alt = soja_head.find('#soja-alt');
            var show_hide = soja_head.find('#soja-show-hide');
            if(soja_head.hasClass('hide')) {
                soja_original.css('display', 'block');
                alt.css('display', 'block');
                show_hide.attr('title', 'hide head');
                soja_head.removeClass('hide')
            } else {
                soja_original.css('display', 'none');
                alt.css('display', 'none');
                show_hide.attr('title', 'show head');
                soja_head.addClass('hide');
            };
        },
        add_image: function(href, alt) {
            soja_image.children('img').detach();
            soja_original.attr('href', href);
            soja_image.append('<img src="'+href+'"/>');
            soja_alt.text(alt);
        },
        change: function(step) {
            soja_image.css('visibility', 'hidden');
            soja_wait.css('visibility', 'visible');
            M.add_image(
                $(soja_group[step]).attr('href'),
                $(soja_group[step]).children('img').attr('alt')
            );
            soja_image.children('img').load(function() {
                M.set_image_size(soja_image.children('img'));
                M.set_view_position(soja_image);
                soja_wait.css('visibility', 'hidden');
                soja_image.css('visibility', 'visible');
            });

            img_size[0] = 0;
            img_size[1] = 0;
        },
        prev: function(step) {
            if(prev >= 0) {
                M.change(step);active-=1;prev-=1;next-=1;
            } else {
                active = soja_group.length-1;
                prev = soja_group.length-2;
                next = soja_group.length;
                M.change(active);
            };
        },
        next: function(step) {
            if(next <= soja_group.length-1) {
                active+=1;
                prev+=1;
                next+=1;
                M.change(step);
            } else {
                active=0;
                prev=-1;
                next=1;
                M.change(active);
            };
        },
        set_box_size: function() {
            soja.css({'width':W.width(),'height':D.height()});
        },
        set_view_position: function(view) {
            view.css({
                'left': (W.width()/2)-(view.width()/2)+W.scrollLeft(),
                'top': (W.height()/2)-(view.height()/2)+W.scrollTop()
            });
        },
        set_nav_position: function() {
            if(soja_group) {
                var half_win_height = W.height()/2,
                    top_pos = (half_win_height-S['nav_button'][1])+W.scrollTop();

                soja_prev.css('top',top_pos);
                soja_next.css({
                    'top': top_pos,
                    'left': (W.width()-S['nav_button'][0])+W.scrollLeft()
                });
            };
        },
        set_image_size: function(img) {
            if(img_size[0] == 0 && img_size[1] == 0) {
                img_size[0] = img.width();
                img_size[1] = img.height();
            };

            win_height = W.height();
            if(img_size[1]>=win_height) {
                img.css('height', win_height*S['image_size'][0]);
            } else if(img_size[0]>=W.width()) {
                img.css('width', win_height*S['image_size'][1]);
            }
        }
    };
})( jQuery );