//=============================================================================
//title             :sojabox
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
            extensions = new Array('.jpg','.png','.gif');
            $('<style>\
                #sojabox{display:none;position:absolute;top:0;left:0}\
                #soja_background{background-color:#000;left:0;position:absolute;top:0;z-index:1000}\
                #soja_top_panel{overflow:auto;background-color:#333;border-bottom:5px solid #eee;z-index: 1030;position:absolute}\
                #soja_top_panel div{padding:0 15px;}\
                #soja_top_panel div a{float:left;padding:3px;color:#ccc;text-decoration:none}\
                #soja_top_panel div a.soja_copyright{margin-right:10px;}\
                #soja_top_panel div a.soja_close{float:right}\
                #soja_wait,#soja_container{overflow:auto;display:none;position:absolute;z-index:1020;border:5px solid #666;}\
                #soja_wait{display:block;z-index:1010}\
            </style>\
            <div id="sojabox">\
                <div id="soja_background">\
                    <div id="soja_top_panel">\
                        <div>\
                            <a href="http://haengebruegge.de" class="soja_copyright">HB</a>\
                            <a href="" class="soja_original">ORIGINAL</a>\
                            <a href="#" class="soja_close">CLOSE</a>\
                        </div>\
                    </div>\
                </div>\
                <div id="soja_wait"><img src="img/wait.gif" alt="wait"/></div>\
                <div id="soja_container"></div>\
            </div>').appendTo('body');

            return this.each(function(){
                win.resize(function() {
                    methods.set_image_size();
                    methods.set_view_position(soja_wait);
                    methods.set_view_position(soja_container);
                    methods.set_background_size();
                });
                $('a.sojabox').bind('click', function(e) {
                    e.preventDefault();
                    methods.open($(this));
                    return false;
                });
            });
        },
        open: function(target) {
            sojabox = $('#sojabox');
            soja_background = sojabox.children('#soja_background');
            soja_top_panel = soja_background.children('#soja_top_panel');
            soja_container = sojabox.children('#soja_container');
            soja_wait = sojabox.children('#soja_wait');

            //~ soja_group = null;
            //~ if(target.attr('rel')) {soja_group = target.attr('rel');}

            for(key in extensions) {
                href = target.attr('href');
                if(href.toLowerCase().indexOf(extensions[key]) >= 0) {
                    soja_top_panel.children('a.soja_original').attr(
                        'href',
                        href
                    );
                    soja_container.append(
                        '<img id="soja_image" src="'+href+'"/>'
                    );
                    break;
                }
            };

            soja_image = soja_container.children('#soja_image');
            methods.set_view_position(soja_wait);
            methods.set_background_size();
            sojabox.css('display', 'block');

            soja_image.each(function() {
                $(this).load(function() {
                    soja_image.css('height', win.height() * 0.75);
                    methods.set_view_position(soja_container);
                    soja_container.css('display', 'block');
                    soja_wait.css('display', 'none');
                });
            });

            soja_top_panel.children('a.soja_close').bind('click', function(e) {
                e.preventDefault();
                methods.close();
                return false;
            });
        },
        close: function() {
            sojabox.css('display', 'none');
            soja_container.css('display', 'none');
            soja_wait.css('display', 'block');
            soja_image.detach();
        },
        set_background_size: function() {
            soja_top_panel.css('width', win.width());
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

    $.fn.sojabox = function(method) {
        if ( methods[method] ) {
            return methods[ method ].apply(
                this,
                Array.prototype.slice.call( arguments, 1 )
            );
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.sojabox' );
        }
    };
})( jQuery );