import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  private_license: function() {
    return this.get('license.type') == 'private';
  }.property('license.type')
});