import Ember from 'ember';
import modal from '../utils/modal';
import app_state from '../utils/app_state';

export default modal.ModalController.extend({
  opening: function() {
    this.set('model.jump_home', true);
    this.set('model.keep_as_self', false);
    var supervisees = [];
    if(app_state.get('sessionUser.supervisees')) {
      app_state.get('sessionUser.supervisees').forEach(function(supervisee) {
        var res = Ember.Object.create(supervisee);
        res.set('currently_selected', app_state.get('currentUser.id') == supervisee.id);
        supervisees.push(res);
      });
    }
    this.set('model.supervisees', supervisees);
  },
  self_currently_selected: function() {
    return app_state.get('currentUser.id') && app_state.get('currentUser.id') == app_state.get('sessionUser.id');
  }.property('app_state.currentUser.id'),
  actions: {
    select: function(board_for_user_id) {
      var jump_home = this.get('model.jump_home');
      var keep_as_self = this.get('model.keep_as_self');
      modal.close();
      app_state.set_speak_mode_user(board_for_user_id, jump_home, keep_as_self);
    }
  }
});
