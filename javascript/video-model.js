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
