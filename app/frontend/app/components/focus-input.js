import Ember from 'ember';

export default Ember.TextField.extend({
  becomeFocused: function() {
    this.$().focus().select();
  }.on('didInsertElement'),
  focusOut: function() {
    this.sendAction();
  }
});