Travel.Parallax = {
  start: function() {
    // initialize initial height before setting top
    $('.parallax').each(function(_, element) {
      var $element = $(element);
      $element.data({ 'initial-height': $element.height() });
    });

    $(window).scroll(Travel.Parallax.onScroll);
  },

  onScroll: function() {
    var $window = $(window);
    var topOffset = $window.scrollTop();

    $('.staged video').offset({ top: topOffset });

    $('.staged .parallax').each(function(_, element) {
      var $element = $(element);
      var speed = parseInt($element.data('speed'));
      var initial = parseFloat($element.data('initial')) || 0; // offset %
      var containerSelector = $element.data('container');
      var prop = $element.data('prop');

      var $container;
      if (containerSelector) {
        $container = $element.closest(containerSelector);
      }
      else {
        $container = $element.parent();
      }

      var offset = initial * $container.height() + $element.data('initial-height');

      // scroll position of the parent container
      var parentTop = $container.offset().top;
      // scaled difference of the parent container and the scroll position
      // should be negative if the parent scrolls past the top of the screen
      // and possitive if it hasn't
      var distance = (topOffset - parentTop) * speed;
      // scaled scrolling distance with an offset, this is the relative scroll
      // value with an offset
      var topValue = distance + offset;

      // if we are setting the bottom, find the position of the bottom of the
      // container, and subtract the scroll amount from that
      if (prop == 'bottom') {
        topValue = ($container.height() + parentTop) - topValue;
      }
      // if we are using top, just add the relative scroll value to the parent
      // position
      else if (prop == 'top') {
        topValue = parentTop + topValue;
      }

      $element.offset({ top: topValue })
      $element.css({ opacity: distance * 0.01 });
    });
  }
}
