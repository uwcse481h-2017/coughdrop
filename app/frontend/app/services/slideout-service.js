import Ember from 'ember';

// A service to emit events related to the board-editor-slideout.
export default Ember.Service.extend(Ember.Evented, {
  // Notify listener to toggle the board editor slideout.
  emitToggleSlideout: function() {
    this.trigger('toggleSlideout');
  },
  // Notify the listener to remove the button whose label's (x) removal
  // button was clicked in the slideout.
  emitRemoveButton: function(button) {
    this.trigger('slideoutRemoveButton', button.id);
  }
});
