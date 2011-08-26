/*
 * @author      daniel 'lynage' brüggemann
 * @date        24.August.2011
 * @license     WTFPL2
 * @version     0.1
 */

html = '<div class="dv_box">\
            <div class="dv_layer"></div>\
            <div class="dv_wait"><img src="img/wait.gif" alt="wait"/></div>\
            <div class="dv_container">\
                <a href="#" class="dv_close" onclick="dv_close(); return false;">X - CLOSE</a>\
            </div>\
        </div>'
extensions = new Array('.jpg', '.png', '.gif');

$(window).ready(function()
{
    $('.diview').load().attr('onclick', 'return false;');

    dv_open();
});

$(window).resize(function()
{
    set_box_position('.dv_container');
    set_layer_size();
});

function dv_open()
{
    $('.diview').click(function()
    {
        $(html).appendTo('body');

        for(key in extensions)
        {
            href = $(this).attr('href');
            if(href.toLowerCase().indexOf(extensions[key]) >= 0)
            {
                $('.dv_container').append('<img class="dv_image" src="'+href+'" />');
                break;
            }
        }

        set_box_position('.dv_wait');
        set_layer_size();
        $('.dv_box').css('display', 'block');

        $('.dv_image').each(function()
        {
            $(this).load(function()
            {
                set_image_size()
                set_box_position('.dv_container');

                $('.dv_container').css('display', 'block');
                $('.dv_wait').css('display', 'none');
            });
        });
    });
}

function set_box_position(box)
{
    $(box).css({
        'left': ($(window).width() / 2)
            - ($(box).width() / 2)
            + $(window).scrollLeft(),
        'top': ($(window).height() / 2)
            - ($(box).height() / 2)
            + $(window).scrollTop()
    });
}

function set_layer_size()
{
    $('.dv_layer').css({
        'width': $(document).width(),
        'height': $(document).height()
    });
}

function set_image_size()
{
    $('.dv_image').css('height', $(window).height() * 0.75);
}

function dv_close()
{
    $('.dv_box').css('display', 'none');
    $('.dv_container').css('display', 'none');
    $('.dv_wait').css('display', 'block');
    $('.dv_image').detach();
}
