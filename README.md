## INFO
    title             :sojabox
    description       :jQuery Imageviewer
    author            :Daniel 'haengebruegge' Brüggemann
    license           :WTFPL2
    date              :20111225
    version           :0.next
    notes             :
    jquery version    :1.7.1

---
## USEAGE
    * customize and bind css file
    * bind jquery and the sojabox.js
    * create a new sojabox object on an elemnt what contains images to show
        * <script type="text/javascript">$('#page p').sojabox();</script>
    * a link wrapped around the an image
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

    [0.next]
        * set commits...

    [0.after]
        * able to recharge other elements like a website or a normal p tag
        * print function
        * zoom function
