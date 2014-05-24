$(function() {
  var mapOptions = {
    center: new google.maps.LatLng(-30, 150),
    zoom: 12
  };

  map = new google.maps.Map($('#map-canvas')[0], mapOptions);

  var $container = $('.container');

  $container.waypoint(function(direction) {
    var $body = $('body');
    if (direction == 'down') {
      $body.addClass('noscroll');
      $container.addClass('focused');
    }
    //else {
      //$body.removeClass('noscroll');
      //$container.removeClass('focused');
    //}
  });

  $('.video').each(function(_, videoContainer) {
    var $container = $(videoContainer);
    var video = $container.find('video');
    var videoFooter = $container.find('.video__footer');

    // if scrolling to the video play
    video.waypoint(function() {
      video[0].play();

      var center = new google.maps.LatLng($container.data('lat'),
                                          $container.data('lng'));
      map.setCenter(center);
    }, { context: '.video-container', offset: '25%' });

    // if scrolling past the video, pause
    video.waypoint(function(direction) {
      if (direction == 'up') {
        video[0].pause();
      }
    }, { context: '.video-container', offset: '100%' });

    // if scrolling past the video pause
    videoFooter.waypoint(function() {
      video[0].pause();
    }, { context: '.video-container' });
  });
});
