import Ember from 'ember';
import modal from '../utils/modal';

export default modal.ModalController.extend({
  opening: function() {
    this.set('model', this.get('model.board'));
  },
  images_with_license: function() {
    return this.get('model.local_images_with_license');
  }.property('model.buttons', 'model.grid'),
  sounds_with_license: function() {
    return this.get('model.local_sounds_with_license');
  }.property('model.buttons', 'model.grid'),
  actions: {
    close: function() {
      modal.close();
    },
    show_licenses: function() {
      this.set('showing_licenses', true);
    },
    boardStats: function() {
      modal.open('board-stats', {board: this.get('model')});
    },
    button_set_words: function() {
      modal.open('button-set', {board: this.get('model'), button_set: this.get('model.button_set')});
    }
  }
});