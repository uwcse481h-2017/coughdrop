import Ember from 'ember';
import CoughDrop from '../../app';
import i18n from '../../utils/i18n';

export default Ember.Component.extend({
  didInsertElement: function() {
    this.draw();
  },
  elem_class: function() {
    if(this.get('side_by_side')) {
      return Ember.String.htmlSafe('col-sm-6');
    } else {
      return Ember.String.htmlSafe('col-sm-8');
    }
  }.property('side_by_side'),
  elem_style: function() {
    if(this.get('right_side')) {
      return Ember.String.htmlSafe('border-left: 1px solid #eee;');
    } else {
      return Ember.String.htmlSafe('');
    }
  }.property('right_side'),
  draw: function() {
    var stats = this.get('usage_stats');
    var ref_stats = this.get('ref_stats');
    var elem = this.get('element').getElementsByClassName('daily_stats')[0];

    CoughDrop.Visualizations.wait('word-graph', function() {
      if(elem && stats && stats.get('days')) {
        var raw_data = [[i18n.t('day', "Day"), i18n.t('total_words', "Total Words"), i18n.t('unique_words', "Unique Words")]];
        if(stats.get('modeled_words')) {
          raw_data[0].push(i18n.t('modeled_words', "Modeled Words"));
        }
        var max_words = 0;
        for(var day in stats.get('days')) {
          var day_data = stats.get('days')[day];
          var row = [day, day_data.total_words, day_data.unique_words];
          if(stats.get('modeled_words')) {
            row.push(day_data.modeled_words);
          }
          raw_data.push(row);
          max_words = Math.max(max_words, day_data.total_words || 0);
        }
        if(ref_stats) {
          for(var day in ref_stats.get('days')) {
            var day_data = ref_stats.get('days')[day];
            max_words = Math.max(max_words, day_data.total_words || 0);
          }
        }
        var data = window.google.visualization.arrayToDataTable(raw_data);

        var options = {
    //          curveType: 'function',
          legend: { position: 'bottom' },
          chartArea: {
            left: 60, top: 20, height: '70%', width: '80%'
          },
          vAxis: {
            baseline: 0,
            viewWindow: {
              min: 0,
              max: max_words
            }
          },
          colors: ['#428bca', '#444444', '#f2b367'],
          pointSize: 3
        };

        var chart = new window.google.visualization.LineChart(elem);
        window.google.visualization.events.addListener(chart, 'select', function() {
          var selection = chart.getSelection()[0];
          var row = raw_data[selection.row + 1];
          console.log("selected date!");
        });
        chart.draw(data, options);
      }
    });
  }.observes('usage_stats.draw_id', 'ref_stats.draw_id')
});
