import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  action: Ember.K, // action to fire on change
  for_user_image: function() {
    var res = null;
    var user_id = this.get('selection');
    (this.get('users') || []).forEach(function(sup) {
      if(sup.id == user_id) {
        res = sup.image;
      }
    });
    return res;
  }.property('users', 'selection')
});
