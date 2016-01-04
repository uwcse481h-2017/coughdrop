import modal from '../utils/modal';
import coughDropExtras from '../utils/extras';
import stashes from '../utils/_stashes';
import utterance from '../utils/utterance';
import CoughDrop from '../app';

export default modal.ModalController.extend({
  show_share: function() {
    if(this.get('utterance_record.link')) {
      coughDropExtras.share.load({link: this.get('utterance_record.link'), text: this.get('sentence')});
    }
  }.observes('utterance_record.link'),
  opening: function() {
    var controller = this;
    var utterances = stashes.get('remembered_vocalizations');
    controller.set('model', {});
    var settings = modal.settings_for['share-utterance'];
    controller.set('utterance', settings.utterance);
    var u = CoughDrop.store.createRecord('utterance', {button_list: settings.utterance, sentence: utterance.sentence(settings.utterance)});
    u.save().then(function(u) {
      controller.set('utterance_record', u);
    }, function() {
      controller.set('utterance_record_error', true);
    });
  },
  sentence: function() {
    if(this.get('utterance')) {
      return utterance.sentence(this.get('utterance'));
    } else {
      return "";
    }
  }.property('utterance'),
  escaped_sentence: function() {
    return encodeURIComponent(this.get('sentence'));
  }.property('sentence')
});