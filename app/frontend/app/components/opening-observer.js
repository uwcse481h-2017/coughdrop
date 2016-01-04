import Ember from 'ember';

export default Ember.Component.extend({
  willInsertElement: function() {
    if(!this.get('already_opened')) {
      this.set('already_opened', true);
      this.sendAction('opening');
    }
  },
  didInsertElement: function() {
    if(!this.get('already_done_opening')) {
      this.set('already_done_opening', true);
      this.sendAction('done_opening');
    }
  },
  willDestroy: function() {
    if(!this.get('already_closed')) {
      this.set('already_closed', true);
      this.sendAction('closing');
    }
  }
});



