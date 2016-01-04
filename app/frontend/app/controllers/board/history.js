import Ember from 'ember';
import CoughDrop from '../../app';

export default Ember.Controller.extend({
  load_results: function() {
    var _this = this;
    CoughDrop.store.query('boardversion', {board_id: this.get('key')}).then(function(res) {
      _this.set('versions', res);
    }, function(err) {
    });
  }
});