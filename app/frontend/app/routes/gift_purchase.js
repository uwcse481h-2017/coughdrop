import Ember from 'ember';
import Subscription from '../utils/subscription';

export default Ember.Route.extend({
  setupController: function(controller, model) {
    Subscription.init();
  }
});
