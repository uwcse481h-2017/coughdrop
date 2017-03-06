import Ember from 'ember';
import app_state from '../utils/app_state';
import i18n from '../utils/i18n';

// A Mixin to handle functionality needed when linking a button to another board.
var linkButton = Ember.Mixin.create({  
  get_supervisees: function() {
    var supervisees = [];
    if(app_state.get('sessionUser.supervisees')) {
      app_state.get('sessionUser.supervisees').forEach(function(supervisee) {
        supervisees.push({
          name: supervisee.user_name,
          image: supervisee.avatar_url,
          disabled: !supervisee.edit_permission,
          id: supervisee.id
        });
      });
      if(supervisees.length > 0) {
        supervisees.unshift({
          name: i18n.t('me', "me"),
          id: 'self',
          image: app_state.get('sessionUser.avatar_url_with_fallback')
        });
      }
    }
    this.set('supervisees', supervisees);
  }
});

export default linkButton;