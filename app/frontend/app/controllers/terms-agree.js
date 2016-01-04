import Ember from 'ember';
import modal from '../utils/modal';
import app_state from '../utils/app_state';

export default modal.ModalController.extend({
  actions: {
    confirm: function() {
      var user = app_state.get('currentUser');
      user.set('terms_agree', true);
      var _this = this;
      user.save().then(function() {
        _this.send('close');
      }, function() {
        _this.set('agree_error', true);
      });
    }
  }
});
