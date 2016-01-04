import Ember from 'ember';
import modal from '../utils/modal';

export default modal.ModalController.extend({
  actions: {
    deleteBoard: function(decision) {
      var _this = this;
      var board = this.get('model.board');
      board.deleteRecord();
      _this.set('model.deleting', true);
      board.save().then(function() {
        modal.close();
        _this.transitionToRoute('index');
      }, function() {
        _this.set('model.deleting', false);
        _this.set('model.error', true);
      });
    }
  }
});