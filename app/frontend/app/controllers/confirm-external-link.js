import modal from '../utils/modal';

export default modal.ModalController.extend({
  actions: {
    open_link: function() {
      modal.close();
      window.open(this.get('model.url'), '_blank');
    }
  }
});