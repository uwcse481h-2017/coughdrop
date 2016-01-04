import modal from '../utils/modal';
import app_state from '../utils/app_state';

export default modal.ModalController.extend({
  home_status_class: function() {
    var res = "glyphicon ";
    if(this.get('model.progress.home_board_set')) {
      res = res + "glyphicon-ok ";
    } else {
      res = res + "glyphicon-home ";
    }
    return res;
  }.property('model.progress.home_board_set'),
  app_status_class: function() {
    var res = "glyphicon ";
    if(this.get('model.progress.app_added')) {
      res = res + "glyphicon-ok ";
    } else {
      res = res + "glyphicon-phone ";
    }
    return res;
  }.property('model.progress.app_added'),
  preferences_status_class: function() {
    var res = "glyphicon ";
    if(this.get('model.progress.preferences_edited')) {
      res = res + "glyphicon-ok ";
    } else {
      res = res + "glyphicon-cog ";
    }
    return res;
  }.property('model.progress.preferences_edited'),
  profile_status_class: function() {
    var res = "glyphicon ";
    if(this.get('model.progress.profile_edited')) {
      res = res + "glyphicon-ok ";
    } else {
      res = res + "glyphicon-user ";
    }
    return res;
  }.property('model.progress.profile_edited'),
  subscription_status_class: function() {
    var res = "glyphicon ";
    if(this.get('model.progress.subscription_set')) {
      res = res + "glyphicon-ok ";
    } else {
      res = res + "glyphicon-usd ";
    }
    return res;
  }.property('model.progress.subscription_set'),
  actions: {
    intro_video: function() {
      alert("not implemented yet...");
      var user = app_state.get('currentUser');
      user.set('preferences.progress.intro_watched', true);
      user.save().then(null, function() { });
    },
    app_install: function() {
      modal.open('add-app');
    },
    setup_done: function() {
      var user = app_state.get('currentUser');
      user.set('preferences.progress.setup_done', true);
      user.save().then(null, function() { });
      modal.close();
    }
  }
});
