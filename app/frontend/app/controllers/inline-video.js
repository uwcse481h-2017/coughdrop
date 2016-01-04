import modal from '../utils/modal';
import i18n from '../utils/i18n';
import CoughDrop from '../app';

export default modal.ModalController.extend({
  opening: function() {
    var _this = this;
    CoughDrop.YT.track('video_preview', function(event_type) {
      if(event_type == 'end') {
        _this.send('close');
      }
    }).then(function(player) {
      _this.set('player', player);
    });
  },
  closing: function() {
    if(this.get('player')) {
      this.get('player').cleanup();
    }
  },
  actions: {
    toggle_video: function() {
      var player = this.get('player');
      if(player.get('paused')) {
        player.play();
      } else {
        player.pause();
      }
    }
  }
});