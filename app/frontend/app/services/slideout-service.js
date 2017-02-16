import Ember from 'ember';

// A service to emit events related to the board-editor-slideout
export default Ember.Service.extend(Ember.Evented, {
  emitToggleSlideout: function() {
    this.trigger('toggleSlideout');
  },
  emitRemoveButton: function(button) {
    this.trigger('slideoutRemoveButton', button);
  }
});
