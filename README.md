## INFO
    title             :sojabox
    description       :jQuery Imageviewer
    author            :Daniel 'haenebruegge' Brüggemann
    license           :WTFPL2
    date              :20111225
    version           :0.2.1
    notes             :
    jquery version    :1.7.1

---
## USEAGE
    * customize and bind css file
    * bind jquery and the sojabox.js
    * create a new sojabox object on an elemnt what contains images to show
        * <script type="text/javascript">$('#page p').sojabox();</script>
    * a link wrapped around the an image
    * use class "sojabox"  in <a> for all images that will show in the view
    * all images in e.g: '#page p' are in the same group

---
## OPTIONS
    * fileext - define a array of strings. Example: new Array('.jpg','.png','.gif')
    * image_size - define a array with width and height of floats. Example: new Array(0.85, 1.5),
    * nav_button - define a array with width and height of Integer, in 'px'. Example: new Array(32, 32),
    * wait_img - path to a wait image, default: 'img/wait.gif'

    All shown options are the defaults of sojabox.

---
## TODO

    [0.2.2]
        * set commits...
        * check IE compatibility
            * on first click, image will not resize..
    [0.3]
        * should sojabox show content, like a external website?!
        * print function
    [0.4]
        * zoom function...
