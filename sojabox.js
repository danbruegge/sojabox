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
            //~ $('').appendTo('body');

            return this.each(function(){
                win.resize(function() {
                    methods.set_view_position(soja_wait);
                    methods.set_view_position(soja_image);
                    methods.set_box_size();
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
            sojabox = $('#sojabox');
            soja_head = sojabox.children('#soja-head');
            soja_body = sojabox.children('#soja-body');
            soja_image = soja_body.children('#soja-image');
            soja_wait = soja_body.children('#soja-wait');

            soja_group_name = null;
            soja_group = null;
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

                console.log(soja_group[prev]);
                console.log(soja_group[active]);
                console.log(soja_group[next]);
            };

            for(key in extensions) {
                href = target.attr('href');
                if(href.toLowerCase().indexOf(extensions[key]) >= 0) {
                    soja_head.children('a.soja-original').attr(
                        'href',
                        href
                    );
                    soja_image.append('<img src="'+href+'" />');
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

            soja_head.find('div>a.soja-close').bind('click', function(e) {
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
        },
        set_box_size: function() {
            if(soja_group) {
                soja_prev.css('top',(win.height()/2)-10+win.scrollTop());
                soja_next.css({
                    'left': win.width()-(20*2)-win.scrollLeft(),
                    'top': (win.height()/2)-10+win.scrollTop()
                });
            };
            sojabox.css({'width': win.width(),'height': win.height()});
        },
        set_view_position: function(view) {
            view.css({
                'left': (win.width()/2)-(view.width()/2)+win.scrollLeft(),
                'top': (win.height()/2)-(view.height()/2)+win.scrollTop()
            });
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