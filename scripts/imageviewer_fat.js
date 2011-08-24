/*
 * @author  deadshox
 * @date    19.May.2011
 */

$(window).ready(function()
{
    iv_open();
    iv_close();
});

$(window).resize(function()
{
    set_box_position();
    set_layer_size();
});

function iv_open()
{
    $('.iv_open').click(function()
    {
        set_box_position('.iv_wait');
        set_layer_size();
        $('.iv_box').css('display', 'block');

        src = this.src.replace('thumbs', '');
        alt = this.alt;

        $('.iv_original > a').attr('href', src);

        $('.iv_image').each(function()
        {
            $(this).attr({
                'src': src,
                'alt': alt
            });

            $(this).load(function()
            {
                $(this).css('height', $(window).height() * 0.75);

                set_box_position('.iv_image_container');

                $('.iv_image_container').css('display', 'block');
                $('.iv_wait').css('display', 'none');
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
    $('.iv_layer').css({
        'width': $(document).width(),
        'height': $(document).height()
    });
}

function iv_close()
{
    $('.iv_image_container').click(function()
    {
        $('.iv_box').css('display', 'none');
        $('.iv_image').attr({'src': '#', 'alt': '#'});
        $('.iv_image_container').css('display', 'none');
        $('.iv_wait').css('display', 'block');
    });

    $('.iv_layer').click(function()
    {
        $('.iv_box').css('display', 'none');
        $('.iv_image').attr({'src': '#', 'alt': '#'});
        $('.iv_image_container').css('display', 'none');
        $('.iv_wait').css('display', 'block');
    });
}
