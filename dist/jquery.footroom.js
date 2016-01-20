/*! footroom - v0.0.1 - 2016-01-20
* Copyright (c) 2016 Zhang Xin; Licensed MIT */
(function ($) {
  function Footroom(elem, options) {
    options = _.defaults(options, Footroom.options);

    this.lastKnownScrollY = 0;
    this.elem = elem;
    this.$elem = $(elem);
    this.classes = options.classes;
    this.tolerance = options.tolerance;
    this.scroller = options.scroller;
    this.offset = options.offset;
    this.initialized = false;

    this.onPin = options.onPin;
    this.onUnpin = options.onUnpin;
  }
  Footroom.prototype = {
    constructor: Footroom,
    init: function () {
      _.defer(_.bind(this.attachEvent, this), 100);
    },
    destroy: function () {
      this.initialized = false;
      var classes = this.classes;
      this.$elem.removeClass([classes.unpinned, classes.pinned, classes.top, classes.initial].join(' '));
      $(this.scroller).off('scroll.footroom');
    },
    //Attaches the scroll event
    attachEvent: function () {
      if (!this.initialized) {
        this.lastKnownScrollY = this.getScrollY();
        this.initialized = true;
        $(this.scroller).on('scroll.footroom', _.throttle(_.bind(this.update, this), 250));
      }
    },
    pin: function () {
      var classes = this.classes;

      if (this.$elem.hasClass(classes.unpinned)) {
        this.$elem.addClass(classes.pinned);
        this.$elem.removeClass(classes.unpinned);
        if (this.onPin) {
          this.onPin.call(this);
        }
      }
    },
    unpin: function () {
      var classes = this.classes;

      if (this.$elem.hasClass(classes.pinned) || !this.$elem.hasClass(classes.unpinned)) {
        this.$elem.addClass(classes.unpinned);
        this.$elem.removeClass(classes.pinned);
        if (this.onUnpin) {
          this.onUnpin.call(this);
        }
      }
    },
    bottom: function () {
      var classes = this.classes;

      if (!this.$elem.hasClass(classes.bottom)) {
        this.$elem.addClass(classes.bottom);
        this.$elem.removeClass(classes.noBottom);
      }
    },
    noBottom: function () {
      var classes = this.classes;

      if (!this.$elem.hasClass(classes.noBottom)) {
        this.$elem.removeClass(classes.bottom);
        this.$elem.addClass(classes.noBottom);
      }
    },
    // Gets the Y scroll position
    getScrollY: function () {
      return (this.scroller.pageYOffset !== undefined) ?
        this.scroller.pageYOffset :
        (this.scroller.scrollTop !== undefined) ?
        this.scroller.scrollTop :
        (document.documentElement || document.body.parentNode || document.body).scrollTop;
    },
    // Gets the height of the viewport
    getViewportHeight: function () {
      return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    },
    // Gets the height of the document
    getDocumentHeight: function () {
      var body = document.body;
      var documentElement = document.documentElement;

      return Math.max(
        body.scrollHeight, documentElement.scrollHeight,
        body.offsetHeight, documentElement.offsetHeight,
        body.clientHeight, documentElement.clientHeight
      );
    },
    // Gets the height of the DOM element
    getElementHeight: function (elm) {
      return Math.max(
        elm.scrollHeight,
        elm.offsetHeight,
        elm.clientHeight
      );
    },
    // Gets the height of the scroller element
    getScrollerHeight: function () {
      return (this.scroller === window || this.scroller === document.body) ?
        this.getDocumentHeight() :
        this.getElementHeight(this.scroller);
    },
    toleranceExceeded: function (currentScrollY, direction) {
      return Math.abs(currentScrollY - this.lastKnownScrollY) >= this.tolerance[direction];
    },
    isOutOfBounds: function (currentScrollY) {
      var pastTop = currentScrollY < 0;
      var pastBottom = currentScrollY + this.getViewportHeight() > this.getScrollerHeight();

      return pastTop || pastBottom;
    },
    // determine if it is appropriate to pin
    shouldPin: function (currentScrollY, toleranceExceeded) {
      var scrollingUp = currentScrollY < this.lastKnownScrollY;
      var pastOffset = currentScrollY + this.getViewportHeight() + this.offset < this.getScrollerHeight();

      return (scrollingUp && toleranceExceeded) || pastOffset;
    },
    // determine if it is appropriate to unpin
    shouldUnpin: function (currentScrollY, toleranceExceeded) {
      var scrollingDown = currentScrollY > this.lastKnownScrollY;
      var pastOffset = currentScrollY + this.getViewportHeight() + this.offset >= this.getScrollerHeight();

      return scrollingDown && toleranceExceeded && pastOffset;
    },
    update: function () {
      var currentScrollY = this.getScrollY();
      var scrollDirection = currentScrollY > this.lastKnownScrollY ? 'down' : 'up';
      var toleranceExceeded = this.toleranceExceeded(currentScrollY, scrollDirection);

      if (this.isOutOfBounds(currentScrollY)) { // Ignore bouncy scrolling in OSX
        return;
      }

      if (currentScrollY + this.getViewportHeight() >= this.getScrollerHeight()) {
        this.bottom();
      } else {
        this.noBottom();
      }

      if (this.shouldUnpin(currentScrollY, toleranceExceeded)) {
        this.unpin();
      } else if (this.shouldPin(currentScrollY, toleranceExceeded)) {
        this.pin();
      }

      this.lastKnownScrollY = currentScrollY;
    }
  };

  Footroom.options = {
    tolerance: {
      up: 0,
      down: 0
    },
    offset: 0,
    scroller: window,
    classes: {
      pinned: 'footroom--pinned',
      unpinned: 'footroom--unpinned',
      bottom: 'footroom--bottom',
      noBottom: 'footroom--not-bottom',
      initial: 'footroom'
    }
  };

  $.fn.footroom = function (option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('footroom');
      var options = typeof option === 'object' && option;

      options = $.extend(true, {}, Footroom.options, options);

      if (!data) {
        data = new Footroom(this, options);
        data.init();
        $this.data('footroom', data);
      }
      if (typeof option === 'string') {
        data[option]();
      }
    });
  };


  $('[data-footroom]').each(function () {
    var $this = $(this);
    $this.footroom($this.data());
  });

}(jQuery));
