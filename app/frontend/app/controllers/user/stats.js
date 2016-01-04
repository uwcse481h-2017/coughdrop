import Ember from 'ember';
import i18n from '../../utils/i18n';
import persistence from '../../utils/persistence';
import CoughDrop from '../../app';
import app_state from '../../utils/app_state';
import modal from '../../utils/modal';
import Stats from '../../utils/stats';

export default Ember.Controller.extend({
  title: function() {
    if(this.get('model.user_name')) {
      return "Usage Reports for " + this.get('model.user_name');
    }
  }.property('model.user_name'),
  queryParams: ['start', 'end', 'location_id', 'device_id'],
  reset_params: function() {
    var _this = this;
    _this.set('model', {});
    this.get('queryParams').forEach(function(param) {
      _this.set(param, null);
    });
  },
  start: null,
  end: null,
  location_id: null,
  device_id: null,
  device_name: function() {
    if(this.get('device_id') && this.get('usage_stats')) {
      var stats = this.get('usage_stats');
      if(stats.devices && stats.devices[0] && stats.devices[0].name) {
        return stats.devices[0].name;
      }
    }
    return i18n.t('device', "device");
  }.property('device_id', 'usage_stats'),
  location_name: function() {
    var location_id = this.get('location_id');
    var stats = this.get('usage_stats');
    if(location_id && stats && stats.locations) {
      var location = stats.locations.find(function(l) { return l.id == location_id; });
      if(location) {
        if(location.type == 'geo') {
          return location.short_name || i18n.t('geo_location', "geo location");
        } else if(location.type == 'ip_address') {
          return location.readable_ip_address || i18n.t('ip_location', "ip address");
        }
      }
    }
    return i18n.t('location', "location");
  }.property('location_id', 'usage_stats'),
  refresh_on_type_change: function() {
    var _this = this;
    Ember.run.scheduleOnce('actions', this, this.load_charts);
  }.observes('start', 'end', 'location_id', 'device_id', 'model.id'),
  draw_charts: function() {
    var stats = this.get('usage_stats');
    var controller = this;
    if(!stats) { return; }
    
    if(controller.get('model.preferences.geo_logging')) {
      var done = function() {
        var current_info = null;
        if(document.getElementById('geo_map')) {
          var map = new window.google.maps.Map(document.getElementById('geo_map'), {
            scrollwheel: false,
            maxZoom: 18
          });
          var markers = [];
          stats.get('geo_locations').forEach(function(location) {
            var title = i18n.t('session_count', "session", {count: location.total_sessions});
            var marker = new window.google.maps.Marker({
              position: new window.google.maps.LatLng(location.geo.latitude, location.geo.longitude),
              // TODO: https://developers.google.com/maps/documentation/javascript/examples/marker-animations-iteration
              // animation: window.google.maps.Animation.DROP,
              title: title
            });
            // TODO: popup information for each location
            marker.setMap(map);
            markers.push(marker);
          
            var dater = Ember.templateHelpers.date;
            var html = title + "<br/>" + dater(location.started_at, null) + 
                        " to <br/>" + dater(location.ended_at, null) + "<br/>" + 
                        "<a href='#' class='ember_link' data-location_id='" + location.id + "'>filter by this location</a>";
          
            var info = new window.google.maps.InfoWindow({
              content: html
            });
            window.google.maps.event.addListener(marker, 'click', function() {
              if(current_info) {
                current_info.close();
              }
              current_info = info;
              info.open(map, marker);
            });
          });
          var bounds = new window.google.maps.LatLngBounds();
          for(var i=0;i<markers.length;i++) {
           bounds.extend(markers[i].getPosition());
          }
          map.fitBounds(bounds);
        }
      };
      if(stats.get('geo_locations').length > 0) {
        if(!window.google || !window.google.maps) {
          window.ready_to_do_maps = done;
          var script = document.createElement('script');
          script.type = 'text/javascript';
          // TODO: pull api keys out into config file?
          script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
              'callback=ready_to_do_maps&key=AIzaSyBofHMEAGEILQkXWAgO6fAbsLjw6fNJQwM';
          document.body.appendChild(script);
        } else {
          Ember.run.later(done);
        }
      }
    }
  
    var graph = function() {
      var raw_data = [[i18n.t('day', "Day"), i18n.t('total_words', "Total Words"), i18n.t('unique_words', "Unique Words")]];
      for(var day in stats.get('days')) {
        var day_data = stats.get('days')[day];
        raw_data.push([day, day_data.total_words, day_data.unique_words]);
      }
      var data = window.google.visualization.arrayToDataTable(raw_data);

      var options = {
//          curveType: 'function',
        legend: { position: 'bottom' },
        chartArea: {
          left: 60, top: 20, height: '70%', width: '80%'
        },
        colors: ['#428bca', '#444444' ],
        pointSize: 3
      };

      if(document.getElementById('daily_stats')) {
        var chart = new window.google.visualization.LineChart(document.getElementById('daily_stats'));
        window.google.visualization.events.addListener(chart, 'select', function() {
          var selection = chart.getSelection()[0];
          var row = raw_data[selection.row + 1];
          console.log("selected date!");
          console.log(row);
        });
        chart.draw(data, options);
      }
      
      if(stats.get('parts_of_speech_combinations')) {
        var data = new window.google.visualization.DataTable();
        data.addColumn('string', 'From');
        data.addColumn('string', 'To');
        data.addColumn('number', 'Instances');
        var rows = [];
        
        var combos = stats.get('parts_of_speech_combinations');
        var colors = [];
        var new_combos = {};
        for(var idx in combos) {
          var split = idx.split(',');
          var key = split[0] + ", " + split[1];
          new_combos[key] = new_combos[key] || 0;
          new_combos[key] = new_combos[key] + combos[idx];
          if(split[2]) {
            key = " " + split[0] + "," + split[1] + " ";
            new_combos[key] = new_combos[key] || 0;
            new_combos[key] = new_combos[key] + combos[idx];
          }
        }
        var split_check = function(label) {
          var type = label.replace(/^\s+/, '').replace(/\s+$/, '');
          if(!colors[label]) {
            var color = CoughDrop.keyed_colors.find(function(c) { return c.types.indexOf(type) >= 0; });
            colors.push((color || {border: "#ccc"}).border);
            colors[label] = true;
          }
        };
        for(var idx in new_combos) {
          var split = idx.split(",");
          rows.push([split[0], split[1], new_combos[idx]]);
          split.forEach(split_check);
        }
        var options = {
          sankey: {
            node: {
              colors: colors
            }
          }
        };
        data.addRows(rows);
        var chart = new window.google.visualization.Sankey(document.getElementById('parts_of_speech_combinations'));
        chart.draw(data, options);
      }
      
      if(stats.get('parts_of_speech')) {
        var table = [
          ['Task', 'Instances']
        ];
        var parts = stats.get('parts_of_speech');
        var slice_idx = 0;
        var slices = {};
        var color_check = function(c) { return c.types.indexOf(idx) >= 0; };
        for(var idx in parts) {
          table.push([idx, parts[idx]]);
          var color = CoughDrop.keyed_colors.find(color_check);
          slices[slice_idx] = {color: (color || {border: "#ccc"}).border};
          slice_idx++;
        }
        console.log(slices);
        var data = window.google.visualization.arrayToDataTable(table);

        var options = {
          slices: slices
        };

        var chart = new window.google.visualization.PieChart(document.getElementById('parts_of_speech'));

        chart.draw(data, options);
      }
    };
    if(!window.google || !window.google.visualization) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      // TODO: pull api keys out into config file?
      window.ready_to_load_graphs = function() {
        window.google.load("visualization", "1.1", {packages:["corechart", "sankey"], callback: graph});
      };
      script.src = 'https://www.google.com/jsapi?callback=ready_to_load_graphs';
      document.body.appendChild(script);
    
      // https://www.google.com/jsapi?callback=bacon
    } else {
      graph();
    }

    Ember.run.later(function() {
      Ember.$(".time_block").tooltip({container: 'body'});
      var $canvas = Ember.$("#touch_locations");
      var touch_locations = {};
      var max = 0;
      for(var key in stats.touch_locations) { 
        var points = key.split(/,/);
        var x = Math.round(parseFloat(points[0]) * 100 / 2);
        var y = Math.round(parseFloat(points[1]) * 100 / 4);
        if(x !== undefined && y !== undefined) {
          touch_locations[x] = touch_locations[x] || {};
          touch_locations[x][y] = touch_locations[x][y] || 0;
          touch_locations[x][y] = touch_locations[x][y] + stats.touch_locations[key];
          max = Math.max(max, touch_locations[x][y]);
        }
      }
      if($canvas[0]) {
        var context = $canvas[0].getContext('2d');
        var width = $canvas[0].width;
        var height = $canvas[0].height;
        context.clearRect(0, 0, width, height);
        var stepx = width / 51;
        var stepy = height / 26;
    
        var positions = [];
        for(var idx = 0; idx < 51; idx++) {
          for(var jdx = 0; jdx < 26; jdx++) {
            if(touch_locations[idx] && touch_locations[idx][jdx]) {
              var centerX = (stepx / 2) + (stepx * idx);
              var centerY = (stepy / 2) + (stepy * jdx);
              positions.push({x: centerX, y: centerY, count: touch_locations[idx][jdx]});
            }
          }
        }
        positions = positions.sort(function(a, b) {
          return a.count - b.count;
        });
        ([0,1,2]).forEach(function(iteration) {
          positions.forEach(function(position) {
            var count = position.count;
            var color_pre = null;
            if(iteration === 0 && (count > (max / 50))) {
              color_pre = "rgba(0, 0, 255, ";
            } else if(iteration == 1 && (count > (max / 4))) {
              color_pre = "rgba(255, 255, 0, ";
            } else if(iteration == 2 && (count > (max / 2))) {
              color_pre = "rgba(255, 0, 0, ";
            }
            if(color_pre) {
              context.beginPath();
              var radius = stepy * 5, inner = stepy, outer = stepy * 5;
              if(iteration == 1) { radius = stepy * 4; inner = stepy / 2; outer = stepy * 4; }
              else if(iteration == 2) { radius = stepy * 2; inner = stepy / 4; outer = stepy * 2; }
              context.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
              var grd = context.createRadialGradient(position.x, position.y, inner, position.x, position.y, outer);
              grd.addColorStop(0, color_pre + '1.0)');
              grd.addColorStop(0.3, color_pre + '0.5)');
              grd.addColorStop(1, color_pre + '0.0)');
              context.fillStyle = grd;
              context.fill();
            }
          });
        });
      }

    }, 1000);
  },
  model_id: function() {
    return this.get('model.id');
  }.property('model.id'),
  already_loaded_for_settings: function() {
    var keys = ['start', 'end', 'device_id', 'location_id', 'model_id'];
    var same = true;
    var _this = this;
    keys.forEach(function(key) {
      var val = _this.get(key);
      var last_val = _this.get('last_' + key);
      if(!last_val) {
        same = false;
      } else if(!!val && (val != last_val || last_val == '_blank')) {
        same = false;
      } else if(!val && last_val != '_blank') {
        same = false;
      }
    });
    return same;
  }.property('start', 'end', 'device_id', 'location_id', 'last_start', 'last_end', 'last_device_id', 'last_location_id', 'model_id', 'last_model_id'),
  load_charts: function() { 
    // must have an active paid subscription to access reports for a user's account
    if(!this.get('model.preferences.logging') || !this.get('model.full_premium')) {
      return;
    }
    if(this.get('already_loaded_for_settings')) {
      Ember.run.later(this, this.draw_charts);
      return;
    }
    
    this.set('last_start', this.get('start') || "_blank");
    this.set('last_end', this.get('end') || "_blank");
    this.set('last_device_id', this.get('device_id') || "_blank");
    this.set('last_location_id', this.get('location_id') || "_blank");
    this.set('last_model_id', this.get('model_id') || "_blank");
    var controller = this;
    var args = {};
    ['start', 'end', 'location_id', 'device_id'].forEach(function(key) {
      if(controller.get(key)) {
        args[key] = controller.get(key);
      }
    });
    
    persistence.ajax('/api/v1/users/' + controller.get('model.id') + '/stats/daily', {type: 'GET', data: args}).then(function(data) {
      var stats = Stats.create(data);
      controller.set('usage_stats', stats);
      controller.draw_charts();
    }, function() {
      controller.set('stats_error', true);
    });
  },
  actions: {
    draw_charts: function() {
      this.draw_charts();
    },
    enable_logging: function() {
      var user = this.get('model');
      user.set('preferences.logging', true);
      var _this = this;
      user.save().then(function(user) {
        if(user.get('id') == app_state.get('currentUser.id')) {
          app_state.set('currentUser', user);
        }
        _this.load_charts();
      }, function() { });
    },
    enable_geo_logging: function() {
      var user = this.get('model');
      user.set('preferences.geo_logging', true);
      var _this = this;
      user.save().then(function(user) {
        if(user.get('id') == app_state.get('currentUser.id')) {
          app_state.set('currentUser', user);
        }
        _this.load_charts();
      }, function() { });
    },
    update_filter: function(filter_type) {
      if(filter_type == 'date') {
        var start = this.get('usage_stats.start_date_field');
        var end = this.get('usage_stats.end_date_field');
        this.transitionToRoute('user.stats', this.get('model.user_name'), {queryParams: {start: start, end: end, location_id: this.get('location_id'), device_id: this.get('device_id')}});
      }
    },
    marker_link_select: function(data) {
      if(data.location_id) {
        this.transitionToRoute('user.stats', this.get('model.user_name'), {queryParams: {start: this.get('start'), end: this.get('end'), location_id: data.location_id, device_id: this.get('device_id')}});
      }
    },
    word_cloud: function() {
      modal.open('word-cloud', {stats: this.get('usage_stats'), user: this.get('model')});
    }
  }
});