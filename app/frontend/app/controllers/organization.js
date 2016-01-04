import Ember from 'ember';
import modal from '../utils/modal';
import i18n from '../utils/i18n';

export default Ember.Controller.extend({
  actions: {
    update_org: function() {
      var org = this.get('model');
      org.save().then(null, function(err) {
        console.log(err);
        modal.error(i18n.t('org_update_failed', 'Organization update failed unexpectedly'));
      });
    },
    masquerade: function() {
      if(this.get('model.admin') && this.get('model.permissions.manage')) {
        var user_name = this.get('masquerade_user_name');
        var _this = this;
        this.store.findRecord('user', user_name).then(function(u) {
          var session = _this.get('session');
          var data = session.store.restore();
          data.original_user_name = data.user_name;
          data.as_user_id = user_name;
          data.user_name = user_name;
          session.store.persist(data);
          _this.transitionToRoute('index');
          location.reload();
        }, function() {
          modal.error(i18n.t('couldnt_find_user', "Couldn't retrieve user \"%{user_name}\" for masquerading", {user_name: user_name}));
        });
      }
    }
  }
});