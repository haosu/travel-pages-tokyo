$(function() {
  window.videoTemplate = Travel.Util.initializeTemplate('#template-video-container');
  window.contentTemplate = Travel.Util.initializeTemplate('#template-content-container');
  window.storyTemplate = Travel.Util.initializeTemplate('#template-story-container');
  window.videoManager = new Travel.VideoManager();

  var videoViews = [];

  // initialize the videos
  Travel.VideoData.videos.forEach(function(videoHash) {
    var videoModel = new Travel.Model.Video(videoHash);
    var videoView = new Travel.View.Video(videoModel);

    $('.container').append(videoView.render().$el);
    videoView.setWaypoints();
    videoViews.push(videoView);
  });


  Travel.Parallax.start();

  // scale the content-container height in relation to the video height
  Travel.Util.setContentMargin();
  $(window).resize(function() {
    Travel.Util.setContentMargin();
  });
});
