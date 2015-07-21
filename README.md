# Footroom.js

> Give your pages some footroom. Show your **footer** until you don't need it.


## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.githubusercontent.com/starandtina/footroom.js/master/dist/jquery.footroom.min.js
[max]: https://raw.githubusercontent.com/starandtina/footroom.js/master/dist/jquery.footroom.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="underscore.js"></script>
<script src="dist/footroom.min.js"></script>
<script>
  // See test/demo.html
  jQuery(function ($) {
    (function() {
        $('#footer').footroom({
            tolerance: {
              down : 2010,
              up : 10
            },
            offset : 200,
            classes: {
              pinned: 'slide--reset',
              unpinned: 'slide--up footer-fixed'
            }
        });
    }());
  });
</script>
```


## License

MIT © Zhang Xin
