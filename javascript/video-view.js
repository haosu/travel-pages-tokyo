Travel.View.Video = function(videoModel) {
  return {
    model: videoModel,
    $el: undefined,
    videoRendered: false,
    // Guards against play handler firing before load handler
    // queues up play or pause
    nextAction: undefined,

    render: function() {
      this.$el = $(window.contentTemplate({ videoName: this.model.getName() }));
      this.$el.find('.story-container').append(window.storyTemplate());

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

    renderMap: function() {
      var styles = [{
        stylers: [
          { hue: "#00ffe6" },
          { saturation: -20 }
        ]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          { lightness: 100 },
          { visibility: "simplified" }
        ]
      },
      {
        featureType: "road",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }];
      var location = this.model.getLocation();
      var mapOptions = {
        center: new google.maps.LatLng(location.lat, location.lng),
        zoom: this.model.getZoom(),
        mapTypeControl: false,
        styles: styles
      };
      var $mapContainer = this.$el.find('.story-map');
      var map = new google.maps.Map($mapContainer[0], mapOptions);
    },

    removeVideo: function() {
      this.$el.find('video').remove();
      this.videoRendered = false;
      this.nextAction = undefined;
    },

    removeMap: function() {
    },

    stage: function() {
      this.renderVideo();
      this.renderMap();
    },

    unstage: function() {
      this.removeVideo();
      this.removeMap();
    },

    setWaypoints: function() {
      // add lazy loading of off screen video
      this.$el.waypoint(function(direction) {
        if (direction == 'down') {
          this.stage();
        }
      }.bind(this), { offset: '300%' });

      // add removal of videos that have scrolled off screen
      this.$el.waypoint(function(direction) {
        if (direction == 'down') {
          this.unstage();
        }
      }.bind(this), { offset: '-300%' });

      // reload while scrolling up
      this.$el.waypoint(function(direction) {
        if (direction == 'up') {
          this.stage();
        }
      }.bind(this), { offset: '-300%' });

      // add removal of videos that have scrolled off screen
      this.$el.waypoint(function(direction) {
        if (direction == 'up') {
          this.unstage();
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
