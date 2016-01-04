import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'input',
  type: 'text',
  autocapitalize: 'off',
  autocorrect: 'off',
  attributeBindings: ['placeholder', 'value', 'autocapitalize', 'autocorrect'],
  change: function() {
    this.set('value', this.get('element').value);
  }
});