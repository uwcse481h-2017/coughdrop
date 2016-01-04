import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    check_code: function() {
      if(this.get('redeem_code')) {
        this.transitionToRoute('redeem_with_code', this.get('redeem_code'));
      }
    }
  }
});