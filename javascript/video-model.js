Travel.Model.Video = function(videoHash) {
  return {
    videoHash: videoHash,

    getTitle: function() {
      return this.videoHash.title;
    },

    getStory: function() {
      return this.videoHash.story;
    },

    getZoom: function() {
      return parseInt(this.videoHash.zoom) || 13;
    },

    getLocation: function() {
      return this.videoHash.location || {};
    },

    getPath: function() {
      return this.videoHash.video_path;
    },

    getName: function() {
      var videoPathParts = this.getPath().split('/');
      return videoPathParts[videoPathParts.length - 1].split('.')[0];
    }
  };
};
