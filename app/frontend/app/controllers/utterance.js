import Ember from 'ember';
import speecher from '../utils/speecher';
import utterance from '../utils/utterance';
import i18n from '../utils/i18n';
import coughDropExtras from '../utils/extras';
import modal from '../utils/modal';

export default Ember.Controller.extend({
  title: function() {
    var sentence = this.get('model.sentence') || "something";
    if(this.get('model.show_user') && this.get('model.user')) {
      return (this.get('model.user.name') || this.get('model.user.user_name')) + " said: \"" + sentence + "\"";
    } else {
      return "Someone said: \"" + sentence + "\"";
    }
  }.property('model.sentence', 'model.show_user', 'model.user'),
  show_share: function() {
    this.set('speakable', speecher.ready);
    coughDropExtras.share.load({link: this.get('model.link'), text: this.get('model.sentence')});
  }.observes('model.sentence'),
  user_showable: function() {
    return this.get('model.show_user') && this.get('model.user.name') && this.get('model.user.user_name');
  }.property('model.show_user', 'model.user.name', 'model.user.user_name'),
  actions: {
    show_attribution: function() {
      this.set('model.show_attribution', true);
    },
    vocalize: function() {
      if(speecher.ready) {
        utterance.speak_text(this.get('model.sentence'));
      }
    },
    change_image: function(direction) {
      var index = this.get('model.image_index');
      if(!index) {
        var _this = this;
        this.get('model.button_list').forEach(function(b, idx) {
          if(b.image == _this.get('model.image_url') && !index) {
            index = idx;
          }
        });
      }
      
      if(direction == 'next') {
        index++;
      } else {
        index--;
      }
      if(index < 0) {
        index = this.get('model.button_list').length - 1;
      } else if(index >= this.get('model.button_list').length) {
        index = 0;
      }
      var image = this.get('model.button_list')[index].image;
      this.set('model.image_url', image);
      this.set('model.image_index', index);
    },
    update_utterance: function() {
      this.get('model').save().then(null, function() {
        modal.error(i18n.t('utterance_update_failed', "Sentence update failed"));
      });
    }
  }
});