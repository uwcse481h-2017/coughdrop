import modal from '../utils/modal';

export default modal.ModalController.extend({
  actions: {
    close: function() {
      modal.close(!this.get('model.cancel_on_close'));
    }
  }
});
