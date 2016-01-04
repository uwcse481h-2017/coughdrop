import Ember from 'ember';
import modal from '../utils/modal';

export default modal.ModalController.extend({
  opening: function() {
    this.render_cloud();
  },
  zoom: 1.0,
  render_cloud: function() {
    var list = [];
    var max = 1;
    (this.get('model.stats.words_by_frequency') || []).forEach(function(obj) {
      if(!obj.text.match(/^[\+:]/)) {
        max = Math.max(max, obj.count);
        list.push([obj.text, obj.count]);
      }
    });
    var _this = this;
    console.log(this.get('zoom'));
    window.WordCloud(document.getElementById('word_cloud'), {
      list: list,
      gridSize: 16,
      weightFactor: function (size) {
        return ((size / max) * 245 * _this.get('zoom')) + 5;
      }
    });
  },
  actions: {
    refresh: function() {
      this.render_cloud();
    },
    zoom: function(direction) {
      if(direction == 'in') {
        this.set('zoom', Math.round(this.get('zoom') * 1.2 * 10.0) / 10.0);
      } else {
        this.set('zoom', Math.round(this.get('zoom') / 1.2 * 10.0) / 10.0);
      }
      this.render_cloud();
    }
  }
});