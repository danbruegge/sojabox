//=============================================================================
//title             :soja
//description       :jQuery Imageviewer
//author            :Daniel Brüggemann
//license           :WTFPL2
//date              :20111225
//version           :0.1
//notes             :
//jquery_version    :1.7.1
//=============================================================================

(function($) {
    var methods = {
        init: function(options) {
            win = $(window);
            extensions = new Array('.jpg', '.png', '.gif');
            html = '<div id="soja_box">\
                <div id="soja_background"></div>\
                <div id="soja_wait"><img src="img/wait.gif" alt="wait"/></div>\
                <div id="soja_container"><a href="#">X - CLOSE</a></div>\
            </div>';
            soja_link = $('a.soja');

            return this.each(function(){
                win.resize(function() {
                    methods.set_image_size();
                    methods.set_view_position(soja_wait);
                    methods.set_view_position(soja_container);
                    methods.set_background_size();
                });
                soja_link.bind('click', function(e) {
                    e.preventDefault();
                    methods.open($(this));
                    return false;
                });
            });
        },
        open: function(target) {
            $(html).appendTo('body');
            soja_box = $('#soja_box');
            soja_background = soja_box.children('#soja_background');
            soja_container = soja_box.children('#soja_container');
            soja_wait = soja_box.children('#soja_wait');

            for(key in extensions) {
                href = soja_link.attr('href');
                if(href.toLowerCase().indexOf(extensions[key]) >= 0) {
                    soja_container.append('<img id="soja_image" src="'+href+'" />');
                    break;
                }
            };

            soja_image = soja_container.children('#soja_image');
            methods.set_view_position(soja_wait);
            methods.set_background_size();
            soja_box.css('display', 'block');

            soja_image.each(function() {
                $(this).load(function() {
                    soja_image.css('height', win.height() * 0.75);
                    methods.set_view_position(soja_container);
                    soja_container.css('display', 'block');
                    soja_wait.css('display', 'none');
                });
            });

            soja_container.children('a').bind('click', function(e) {
                e.preventDefault();
                methods.close();
                return false;
            });
        },
        close: function() {
            soja_box.css('display', 'none');
            soja_container.css('display', 'none');
            soja_wait.css('display', 'block');
            soja_image.detach();
        },
        set_background_size: function() {
            soja_background.css({'width': win.width(),'height': win.height()});
        },
        set_view_position: function(view) {
            view.css({
                'left': (win.width()/2)-(view.width()/2)+win.scrollLeft(),
                'top': (win.height()/2)-(view.height()/2)+win.scrollTop()
            });
        },
        set_image_size: function() {
            soja_image.css('height', win.height() * 0.75);
        }
    };

    $.fn.soja = function(method) {
        if ( methods[method] ) {
            return methods[ method ].apply(
                this,
                Array.prototype.slice.call( arguments, 1 )
            );
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.soja' );
        }
    };
})( jQuery );