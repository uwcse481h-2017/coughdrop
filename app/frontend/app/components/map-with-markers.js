import Ember from 'ember';

export default Ember.Component.extend({
  click: function(event) {
    if(event.target.tagName == 'A' && event.target.className == 'ember_link') {
      event.preventDefault();
      this.sendAction('action', Ember.$(event.target).data());
    }
  }
});