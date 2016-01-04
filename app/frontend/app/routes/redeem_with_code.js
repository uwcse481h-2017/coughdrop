import Ember from 'ember';

export default Ember.Route.extend({
  controllerName: 'redeem',
  model: function(params) {
    var obj = this.store.findRecord('gift', params.code);
    return obj.then(function(data) {
      return Ember.RSVP.resolve(data);
    }, function() {
      return Ember.RSVP.resolve(Ember.Object.create({invalid: true, code: params.code}));
    });
  },
  setupController: function(controller, model) {
    var _this = this;

    controller.set('model', model);
  }
});