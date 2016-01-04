import modal from '../utils/modal';
import speecher from '../utils/speecher';

export default modal.ModalController.extend({
  actions: {
    alert: function() {
      speecher.beep();
    }
  }
});
