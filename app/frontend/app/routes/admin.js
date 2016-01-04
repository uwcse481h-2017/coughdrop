import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.findRecord('organization', 'my_org');
  },
  setupController: function(controller, model) {
    this.transitionTo('organization', model.get('id'));
  }
});