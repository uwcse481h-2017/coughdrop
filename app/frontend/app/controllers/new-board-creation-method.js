import Ember from 'ember';
import modal from '../utils/modal';
import CoughDrop from '../app';
import app_state from '../utils/app_state';
import i18n from '../utils/i18n';
import editManager from '../utils/edit_manager';

export default modal.ModalController.extend({
  opening: function() {
    this.set('model', CoughDrop.store.createRecord('board', {public: false, license: {type: 'private'}, grid: {rows: 2, columns: 4}}));
    if(window.webkitSpeechRecognition) {
      var speech = new window.webkitSpeechRecognition();
      if(speech) {
        speech.continuous = true;
        this.set('speech', {engine: speech});
      }
    }

    var supervisees = [];

    var locale = window.navigator.language.replace(/-/g, '_');
    var pieces = locale.split(/_/);
    if(pieces[0]) { pieces[0] = pieces[0].toLowerCase(); }
    if(pieces[1]) { pieces[1] = pieces[1].toUpperCase(); }
    locale = pieces[0] + "_" + pieces[1];
    var locales = i18n.get('locales');
    if(locales[locale]) {
      this.set('model.locale', locale);
    } else {
      locale = locale.split(/_/)[0];
      if(locales[locale]) {
        this.set('model.locale', locale);
      }
    }

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
      this.set('model.for_user_id', 'self');
    }
    this.set('supervisees', supervisees);
  },
  locales: function() {
    var list = i18n.get('locales');
    var res = [{name: i18n.t('choose_locale', '[Choose a Language]'), id: ''}];
    for(var key in list) {
      res.push({name: list[key], id: key});
    }
    res.push({name: i18n.t('unspecified', "Unspecified"), id: ''});
    return res;
  }.property(),
  speech_enabled: function() {
    return !!this.get('speech');
  }.property('speech'),
  closing: function() {
    this.send('stop_recording');
  },
  actions: {
    createManually: function() {
      modal.open('new-board');
    },
    stop_recording: function() {
      if(this.get('speech') && this.get('speech.engine')) {
        this.set('speech.resume', false);
        this.get('speech.engine').abort();
      }
      if(this.get('speech')) {
        this.set('speech.recording', false);
        this.set('speech.almost_recording', false);
      }
    }
  }
});
