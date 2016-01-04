import Ember from 'ember';
import Subscription from '../utils/subscription';
import app_state from '../utils/app_state';

export default app_state.ScrollTopRoute.extend({
  setupController: function(controller, model) {
    controller.set('model', model); 
    controller.set('subscription', Subscription.create());
    Subscription.init();
  }
});
