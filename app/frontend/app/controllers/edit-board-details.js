import Ember from 'ember';
import CoughDrop from '../app';
import app_state from '../utils/app_state';
import modal from '../utils/modal';

export default modal.ModalController.extend({
  opening: function() {
    var board = this.get('model.board');
    this.set('model', board);
    this.set('originally_public', board.get('public'));
  },
  licenseOptions: CoughDrop.licenseOptions,
  iconUrls: CoughDrop.iconUrls,
  attributable_license_type: function() {
    if(!this.get('model.license')) { return; }
    if(this.get('model.license') && this.get('model.license.type') != 'private') {
      this.set('model.license.author_name', this.get('model.license.author_name') || app_state.get('currentUser.name'));
      this.set('model.license.author_url',this.get('model.license.author_url') || app_state.get('currentUser.profile_url'));
    }
    return this.get('model.license.type') != 'private';
  }.property('model.license.type'),
  actions: {
    close: function() {
      modal.close();
    },
    pickImageUrl: function(url) {
      this.set('model.image_url', url);
    }
  }
});
