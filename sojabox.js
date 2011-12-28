// see README
(function($) {
    $.fn.sojabox = function(method) {
        $obj = this;
        if(methods[method]) {
            return methods[ method ].apply(
                this,
                Array.prototype.slice.call(arguments, 1)
            );
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method '+ method + ' does not exist on jQuery.sojabox');
        }
    };

    var methods = {
        init: function(options) {
            win = $(window);
            extensions = new Array('.jpg','.png','.gif');
            image_size = new Array(0.85, 1.5);
            nav_button = new Array(20, 20);

            sojabox = $('#sojabox');
            soja_head = sojabox.children('#soja-head');
            soja_body = sojabox.children('#soja-body');
            soja_image = soja_body.children('#soja-image');
            soja_wait = soja_body.children('#soja-wait');

            soja_group_name = null;
            soja_group = null;
            //~ $('').appendTo('body');

            return this.each(function(){
                win.resize(function() {
                    methods.set_view_position(soja_wait);
                    methods.set_view_position(soja_image);
                    methods.set_box_size();
                    methods.set_nav_position();
                });
                $obj.find('a.sojabox').bind('click', function(e) {
                    e.preventDefault();
                    methods.open($(this));
                    return false;
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
                    if(target[0] == soja_group[i]) { active=i };
                };
                next = active + 1;
                prev = active - 1;

                //~ soja_group[prev], soja_group[active], soja_group[next]

                methods.set_nav_position();

                soja_prev.children('a').bind('click', function(e) {
                    e.preventDefault();
                    methods.prev(prev);
                    return false;
                });

                soja_next.children('a').bind('click', function(e) {
                    e.preventDefault();
                    methods.next(next);
                    return false;
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

            soja_head.find('#soja-close').bind('click', function(e) {
                e.preventDefault();
                methods.close();
                return false;
            });
        },
        close: function() {
            sojabox.css('display', 'none');
            soja_image.css('display', 'none');
            soja_wait.css('display', 'block');
            soja_image.children('img').detach();
            soja_image.children('p').detach();
        },
        add_image: function(href, alt) {
            soja_image.children('img').detach();
            soja_image.children('p').detach();
            soja_image.append('<img src="'+href+'" />');
            soja_image.append('<p>'+alt+'</p>');
        },
        prev: function(step) {
            if(prev >= 0) {
                methods.change(step);
                active -= 1;
                prev -= 1;
                next -= 1;
            };
        },
        next: function(step) {
            if(next <= (soja_group.length-1)) {
                methods.change(step);
                active += 1;
                prev += 1;
                next += 1;
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
            sojabox.css({'width': win.width(),'height': win.height()});
        },
        set_view_position: function(view) {
            view.css({
                'left': (win.width()/2)-(view.width()/2)+win.scrollLeft(),
                'top': (win.height()/2)-(view.height()/2)+win.scrollTop()
            });
        },
        set_nav_position: function() {
            if(soja_group) {
                win_height = win.height();
                half_win_height = win.height()/2;
                scrolltop = win.scrollTop();

                soja_prev.css('top',half_win_height-scrolltop-nav_button[1]);
                soja_next.css({
                    'top': half_win_height-scrolltop-nav_button[1],
                    'left': win.width()-win.scrollLeft()-nav_button[0]
                });
            };
        },
        set_image_size: function(img) {
            if(img.height()>=win.height()) {
                img.css('height', win.height() * image_size[0]);
            } else if(img.width()>=win.width()) {
                img.css('width', win.height() * image_size[1]);
            }
        }
    };
})( jQuery );