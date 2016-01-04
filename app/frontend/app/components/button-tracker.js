import Ember from 'ember';
import buttonTracker from '../utils/raw_events';

export default Ember.Component.extend({
  didInsertElement: function() {
    buttonTracker.setup();
  }
});
