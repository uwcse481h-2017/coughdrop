import Ember from 'ember';
import modal from '../utils/modal';
import editManager from '../utils/edit_manager';
import app_state from '../utils/app_state';
import i18n from '../utils/i18n';

export default modal.ModalController.extend({
  opening: function() {
    var _this = this;
    _this.set('error', null);
    editManager.copy_board(_this.get('model.board'), _this.get('model.action'), _this.get('model.user')).then(function(board) {
      var next = Ember.RSVP.resolve();
      if(_this.get('model.shares') && _this.get('model.shares').length > 0) {
        var promises = [];
        _this.get('model.shares').forEach(function(share) {
          next = next.then(function() {
            var user_name = share.user_name;
            var sharing_key = "add_deep-" + user_name;
            board.set('sharing_key', sharing_key);
            return board.save();
          });
        });
        next = next.then(null, function() {
          return Ember.RSVP.reject(i18n.t('sharing_failed', "Sharing with one or more users failed"));
        });
      }
      
      next.then(function() {
        if(modal.is_open('copying-board')) {
          app_state.jump_to_board({
            id: board.get('id'),
            key: board.get('key')
          });
          modal.close({copied: true, id: board.get('id'), key: board.get('key')});
        } else {
          modal.notice(i18n.t('copy_created', "Copy created! You can find the new board in your profile."));
        }
      }, function(err) {
        if(modal.is_open('copying-board')) {
          _this.set('error', err);
        } else {
          modal.error(err);
        }
      });
    }, function(err) {
      if(modal.is_open('copying-board')) {
        _this.set('error', err);
      } else {
        modal.error(err);
      }
    });
  }
});