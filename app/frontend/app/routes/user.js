import Ember from 'ember';
import persistence from '../utils/persistence';

export default Ember.Route.extend({
  model: function(params) {
    var obj = this.store.findRecord('user', params.user_id);
    var _this = this;
    return obj.then(function(data) {
      var meta = persistence.meta('user', data);
      if(meta && meta.local_result && persistence.get('online')) {
        Ember.run.later(function() {data.reload();});
      }
      return data;
    }).then(function(data) {
      data.set('subroute_name', '');
      return data;
    });
  }
});