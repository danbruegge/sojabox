// see README
(function($) {
    $.fn.sojabox = function(method) {
        $obj = this;
        if(methods[method]) {
            return methods[method].apply(
                this,
                Array.prototype.slice.call(arguments,1)
            );
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method '+method+' does not exist on jQuery.sojabox');
        }
    };

    var methods = {
        init: function(options) {
            w = $(window);
            extensions = new Array('.jpg','.png','.gif');
            image_size = new Array(0.85, 1.5);
            nav_button = new Array(32, 32);

            $('<div id="sojabox"><div id="soja-head"><div><a href="#"id="soja-show-hide"title="hide head"></a><a href="#"id="soja-original"title="original"></a><p id="soja-alt"></p><a href="#"id="soja-close"title="close"></a></div></div><div id="soja-body"><div id="soja-wait"><img src="img/wait.gif"alt="wait"/></div><div id="soja-image"></div><div id="soja-prev"title="prev"><a href="#"></a></div><div id="soja-next"title="next"><a href="#"></a></div></div><div id="soja-bottom"><a href="http://haengebruegge.de"id="soja-copyright">haengebruegge.de</a></div></div>').appendTo('body');
            sojabox = $('#sojabox');
            soja_head = sojabox.children('#soja-head');
            soja_body = sojabox.children('#soja-body');
            soja_image = soja_body.children('#soja-image');
            soja_wait = soja_body.children('#soja-wait');
            soja_alt = soja_head.find('#soja-alt');

            soja_group_name = null;
            soja_group = null;

            return this.each(function(){
                w.resize(function() {
                    methods.set_view_position(soja_wait);
                    methods.set_view_position(soja_image);
                    methods.set_box_size();
                    methods.set_nav_position();
                });
                $obj.find('a.sojabox').unbind('click').bind(
                    'click', function() {
                    methods.open($(this)); return false;
                });
                $('#soja-head div a#soja-close').unbind('click').bind(
                    'click', function() {
                    methods.close(); return false;
                });
                $('#soja-head div a#soja-show-hide').unbind('click').bind(
                    'click', function() {
                    methods.show_hide(); return false;
                });
            });
        },
        open: function(target) {
            $('body').css('overflow', 'hidden');

            if(target.attr('rel')) {
                soja_prev = soja_body.children('#soja-prev');
                soja_next = soja_body.children('#soja-next');
                soja_group_name = target.attr('rel');
                soja_group = $obj.find('a[rel*="'+soja_group_name+'"]');

                for(i=0;i<soja_group.length;i++) {
                    if(target[0]==soja_group[i]) { active=i };
                };
                next=active+1;
                prev=active-1;
                //~ soja_group[prev], soja_group[active], soja_group[next]
                methods.set_nav_position();

                soja_prev.children('a').unbind('click').bind(
                    'click', function() {
                    methods.prev(prev); return false;
                });

                soja_next.children('a').unbind('click').bind(
                    'click', function() {
                    methods.next(next); return false;
                });
            };

            for(key in extensions) {
                href = target.attr('href');
                if(href.toLowerCase().indexOf(extensions[key]) >= 0) {
                    soja_head.find('#soja-original').attr('href',href);
                    methods.add_image(href,target.children('img').attr('alt'));
                    break;
                };
            };

            methods.set_view_position(soja_wait);
            methods.set_box_size();
            sojabox.css('display', 'block');

            soja_image.children('img').each(function() {
                $(this).load(function() {
                    soja_image.css('display', 'block');
                    soja_wait.css('display', 'none');
                    methods.set_image_size($(this));
                    methods.set_view_position(soja_image);
                });
            });
        },
        close: function() {
            sojabox.css('display', 'none');
            soja_image.css('display', 'none');
            soja_wait.css('display', 'block');
            soja_image.children('img').detach();
            soja_alt.text('');
        },
        show_hide: function() {
            var original = soja_head.find('#soja-original');
            var alt = soja_head.find('#soja-alt');
            var show_hide = soja_head.find('#soja-show-hide');
            if(soja_head.hasClass('hide')) {
                original.css('display', 'block');
                alt.css('display', 'block');
                show_hide.attr('title', 'hide head');
                soja_head.removeClass('hide')
            } else {
                original.css('display', 'none');
                alt.css('display', 'none');
                show_hide.attr('title', 'show head');
                soja_head.addClass('hide');
            };
        },
        add_image: function(href, alt) {
            soja_image.children('img').detach();
            soja_image.children('p').detach();
            soja_image.append('<img src="'+href+'" />');
            soja_alt.text(alt);
        },
        prev: function(step) {
            if(prev >= 0) {
                methods.change(step);active-=1;prev-=1;next-=1;
            } else {
                active = soja_group.length-1;
                prev = soja_group.length-2;
                next = soja_group.length;
                methods.change(active);
            };
        },
        next: function(step) {
            if(next <= soja_group.length-1) {
                active+=1;
                prev+=1;
                next+=1;
                methods.change(step);
            } else {
                active=0;
                prev=-1;
                next=1;
                methods.change(active);
            };
        },
        change: function(step) {
            methods.add_image(
                $(soja_group[step]).attr('href'),
                $(soja_group[step]).children('img').attr('alt')
            );
            soja_image.children('img').load(function() {
                methods.set_image_size(soja_image.children('img'));
                methods.set_view_position(soja_image);
            });
        },
        set_box_size: function() {
            sojabox.css({'width':w.width(),'height':w.height()});
        },
        set_view_position: function(view) {
            view.css({
                'left': (w.width()/2)-(view.width()/2)+w.scrollLeft(),
                'top': (w.height()/2)-(view.height()/2)+w.scrollTop()
            });
        },
        set_nav_position: function() {
            if(soja_group) {
                half_win_height = w.height()/2;
                scrolltop = w.scrollTop();

                soja_prev.css('top',half_win_height-scrolltop-nav_button[1]);
                soja_next.css({
                    'top': half_win_height-scrolltop-nav_button[1],
                    'left': w.width()-w.scrollLeft()-nav_button[0]
                });
            };
        },
        set_image_size: function(img) {
            win_height = w.height();
            if(img.height()>=win_height) {
                img.css('height', win_height*image_size[0]);
            } else if(img.width()>=w.width()) {
                img.css('width', win_height*image_size[1]);
            }
        }
    };
})( jQuery );