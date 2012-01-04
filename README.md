## INFO
    title             :sojabox
    description       :jQuery Imageviewer
    author            :Daniel Brüggemann
    license           :WTFPL2
    date              :20111225
    version           :0.1
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
    * use rel="..." in <a> to create view groups
        * ... = whatever your group name is

---
## TODO

    [0.2]
        * clean up the code, make the dev version more readable
        * set commits...
        * add some "fake" effects...
            * set the position of the empty image container, resize the hidden
              image and set the new position. Do the same by resizing an image.
        * using rel= in a tag is bad in html5 without the right attributes...i
          think defining a better solution is to work with the object
          initialisation...$('#some_id').sojabox(); <- all images children are
          in one group.
        * check IE compatibility
        * if window is resized, resize the image too.
    [0.3]
        * should sojabox show content, like a external website?!
        * print function
    [0.4]
        * zoom function...
