/*
 * @author      daniel 'lynage' brüggemann
 * @date        24.August.2011
 * @license     WTFPL2
 * @version     0.1
 */

$(window).ready(function()
{
    dv_open();
    dv_close();
});

$(window).resize(function()
{
    set_box_position('.dv_container');
    set_layer_size();
});

function dv_open()
{
    $('.dv_open_text').click(function()
    {
        set_box_position('.dv_wait');
        set_layer_size();
        $('.dv_box').css('display', 'block');

        $('.dv_text').css('height', $(window).height() * 0.75);

        set_box_position('.dv_container');

        $('.dv_container').css('display', 'block');
        $('.dv_text').css('display', 'block');
        $('.dv_wait').css('display', 'none');
    });

    $('.dv_open_image').click(function()
    {
        set_box_position('.dv_wait');
        set_layer_size();
        $('.dv_box').css('display', 'block');

        src = this.src.replace('/thumbs', '');
        alt = this.alt;

        $('.test').each(function()
        {
            $(this).attr({
                'src': src,
                'alt': alt
            });

            $(this).load(function()
            {
                $(this).css('height', $(window).height() * 0.75);

                set_box_position('.dv_container');

                $('.dv_container').css('display', 'block');
                $('.dv_image').css('display', 'block');
                $('.dv_wait').css('display', 'none');
            });
        });
    });
}

function set_box_position(box)
{
    $(box).css({
        'left': ($(window).width() / 2) - ($(box).width() / 2) + $(window).scrollLeft(),
        'top': ($(window).height() / 2) - ($(box).height() / 2) + $(window).scrollTop()
    });
}

function set_layer_size()
{
    $('.dv_layer').css({
        'width': $(document).width(),
        'height': $(document).height()
    });
}

function dv_close()
{
    $('.dv_container').click(function()
    {
        $('.dv_box').css('display', 'none');
        $('.dv_container').css('display', 'none');
        $('.dv_wait').css('display', 'block');
        $('.dv_text').css('display', 'none');
        $('.dv_image').css('display', 'none');
    });

    $('.dv_layer').click(function()
    {
        $('.dv_box').css('display', 'none');
        $('.dv_container').css('display', 'none');
        $('.dv_wait').css('display', 'block');
        $('.dv_text').css('display', 'none');
        $('.dv_image').css('display', 'none');
    });
}
