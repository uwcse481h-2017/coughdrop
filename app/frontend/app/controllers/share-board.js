import Ember from 'ember';
import modal from '../utils/modal';
import i18n from '../utils/i18n';
import coughDropExtras from '../utils/extras';

export default modal.ModalController.extend({
  show_share: function() {
    if(this.get('board.link')) {
      var _this = this;
      Ember.run.later(function() {
        coughDropExtras.share.load({link: _this.get('board.link'), text: _this.get('board.name')});
      });
    }
  },
  opening: function() {
    var controller = this;
    var board = controller.get('model.board');
    controller.set('model', {});
    controller.set('board', board);
    controller.show_share();
  },
  actions: {
    share_with_user: function() {
      var user_name = this.get('share_user_name');
      var include_downstream = this.get('share_include_downstream');
      var allow_editing = this.get('share_allow_editing');
      var sharing_key = "add_shallow-" + user_name;
      if(allow_editing) {
        sharing_key = "add_edit_shallow-" + user_name;
        if(include_downstream) {
          sharing_key = "add_edit_deep-" + user_name;
        }
      } else {
        if(include_downstream) {
          sharing_key = "add_deep-" + user_name;
        }
      }
      var board = this.get('board');
      board.set('sharing_key', sharing_key);
      board.save().then(function() {
      }, function(xhr) {
        console.log(xhr.responseJSON);
        modal.error(i18n.t('sharing_failed', "Board sharing action failed"));
      });
    },
    unshare: function(id) {
      var sharing_key = "remove-" + id;
      var board = this.get('board');
      board.set('sharing_key', sharing_key);
      board.save().then(function() {
      }, function(xhr) {
        console.log(xhr.responseJSON);
        modal.error(i18n.t('unsharing_failed', "Board unsharing action failed"));
      });
    }
  }
});