var Travel = {
  Model: {},
  View: {},
  Util: {}
};

Travel.VideoManager = function() {
  return {
    stageVideo: function(video) {
      video.play();
      video.$el.addClass('staged');
    },

    unstageVideo: function(video) {
      video.pause();
      video.$el.removeClass('staged');
    }
  };
};

Travel.Util.initializeTemplate = function(templateSelector) {
  var templateMarkup = $(templateSelector);
  var template = Handlebars.compile(templateMarkup.html());
  templateMarkup.remove();
  return template;
};

Travel.Util.setContentMargin = function() {
  $('.content-padding').css({ 'height': $('video').height() * 2 });
};
