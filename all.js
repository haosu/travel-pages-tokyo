var Travel = {
  Model: {},
  View: {}
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

Travel.Model.Video = function(videoHash) {
  return {
    videoHash: videoHash,

    getPath: function() {
      return this.videoHash.video_path;
    },

    getName: function() {
      var videoPathParts = this.getPath().split('/');
      return videoPathParts[videoPathParts.length - 1].split('.')[0];
    }
  };
};

Travel.View.Video = function(videoModel) {
  return {
    model: videoModel,
    $el: undefined,
    videoRendered: false,
    // Guards against play handler firing before load handler
    // queues up play or pause
    nextAction: undefined,

    render: function() {
      this.$el = $(window.contentTemplate());

      return this;
    },

    renderVideo: function() {
      if (!this.videoRendered) {
        this.videoRendered = true;
        this.$el.find('.video-container').append($(window.videoTemplate({
          videoName: this.model.getName(),
          videoPath: this.model.getPath()
        })));
        this.setVideoWaypoints();

        if (this.nextAction) {
          this.nextAction();
          this.nextAction = undefined;
        }
      }
    },

    removeVideo: function() {
      this.$el.find('video').remove();
      this.videoRendered = false;
      this.nextAction = undefined;
    },

    setWaypoints: function() {
      // add lazy loading of off screen video
      this.$el.waypoint(function(direction) {
        if (direction == 'down') {
          this.renderVideo();
        }
      }.bind(this), { offset: '300%' });

      // add removal of videos that have scrolled off screen
      this.$el.waypoint(function(direction) {
        if (direction == 'down') {
          this.removeVideo();
        }
      }.bind(this), { offset: '-300%' });

      // reload while scrolling up
      this.$el.waypoint(function(direction) {
        if (direction == 'up') {
          this.renderVideo();
        }
      }.bind(this), { offset: '-300%' });

      // add removal of videos that have scrolled off screen
      this.$el.waypoint(function(direction) {
        if (direction == 'up') {
          this.removeVideo();
        }
      }.bind(this), { offset: '300%' });
    },

    setVideoWaypoints: function() {
      // play the video while scrolling down
      this.$el.waypoint(function(direction) {
        if (direction == 'down') {
          window.videoManager.stageVideo(this);
        }
      }.bind(this));

      // remove after the container is completely out of the viewport
      this.$el.waypoint(function(direction) {
        if (direction == 'down') {
          window.videoManager.unstageVideo(this);
        }
      }.bind(this), { offset: '-300%' });

      // play the video when scrolling up
      this.$el.waypoint(function(direction) {
        if (direction == 'up') {
          window.videoManager.stageVideo(this);
        }
      }.bind(this), {
        offset: function() {
           return -$(this).height();
        }
      });

      // remove the video after it has scrolled off screen
      this.$el.waypoint(function(direction) {
        if (direction == 'up') {
          window.videoManager.unstageVideo(this);
        }
      }.bind(this));
    },

    play: function() {
      if (this._videoEl()) {
        this._videoEl().play();
      }
      else {
        this.nextAction = this.play;
      }
    },

    pause: function() {
      if (this._videoEl()) {
        this._videoEl().pause();
      }
      else {
        this.nextAction = this.pause;
      }
    },

    $video: function() {
      return this.$el.find('.video-container');
    },

    _videoEl: function() {
      return this.$el.find('video')[0];
    }
  };
};

$(function() {
  window.videoTemplate = Handlebars.compile($('#template-video-container').html());
  window.contentTemplate = Handlebars.compile($('#template-content-container').html());
  window.videoManager = new Travel.VideoManager();

  var videoViews = [];

  Travel.VideoData.videos.forEach(function(videoHash) {
    var videoModel = new Travel.Model.Video(videoHash);
    var videoView = new Travel.View.Video(videoModel);

    $('.container').append(videoView.render().$el);
    videoView.setWaypoints();
    videoViews.push(videoView);
  });

  $window = $(window);

  $window.scroll(function() {
    var topOffset = $window.scrollTop();
    if (topOffset > -1) {
      var $stagedList = $('.staged video');
      $stagedList.each(function(idx, stagedVideo) {
        $(stagedVideo).offset({ top: topOffset });
      });
    }
  });

  var setContentMargin = function() {
    $('.content-padding').css({ 'height': $('video').height() * 2 });
  }();

  $window.resize(function() {
    setContentMargin();
  });
});
