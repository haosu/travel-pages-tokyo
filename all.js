var Travel = {};

$(function() {
  Travel.VideoData.videos.forEach(function(video) {
    var video = $('<video>').attr('src', video.video_path);
    $('.container').append(video);
  });
});
