import Ember from 'ember';
import i18n from '../../utils/i18n';

export default Ember.Controller.extend({
  title: function() {
    return "Log Details";
  }.property('model.user_name'),
  draw_charts: function() {
    if(!this.get('model.geo')) { 
      return; 
    }
    var user = this.get('user');
    if(user && user.get('preferences.geo_logging') && document.getElementById('geo_map')) {
      var geo = this.get('model.geo');
      var done = function() {
        var current_info = null;
        var map = new window.google.maps.Map(document.getElementById('geo_map'), {
          scrollwheel: false,
          maxZoom: 18
        });
        var markers = [];
        
        var title = i18n.t('session_location', "Log Entry Location");
        var marker = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(geo.latitude, geo.longitude),
          title: title
        });
        // TODO: popup information for each location
        marker.setMap(map);
        markers.push(marker);
          
        var bounds = new window.google.maps.LatLngBounds();
        for(var i=0;i<markers.length;i++) {
         bounds.extend(markers[i].getPosition());
        }
        map.fitBounds(bounds);
      };
      if(geo) {
        if(!window.google || !window.google.maps) {
          window.ready_to_do_log_map = done;
          var script = document.createElement('script');
          script.type = 'text/javascript';
          // TODO: pull api keys out into config file?
          script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
              'callback=ready_to_do_log_map&key=AIzaSyBofHMEAGEILQkXWAgO6fAbsLjw6fNJQwM';
          document.body.appendChild(script);
        } else {
          Ember.run.later(done);
        }
      }
    }
  }.observes('model.geo', 'user'),
  actions: {
    lam_export: function() {
      window.open('/api/v1/logs/' + this.get('model.id') + '/lam?nonce=' + this.get('model.nonce'));
    },
    toggle_notes: function(id, action) {
      this.get('model').toggle_notes(id);
      if(action == 'add') {
        Ember.run.later(function() {
          Ember.$("input[data-event_id='" + id + "']").focus().select();
        }, 200);
      }
    },
    add_note: function(event_id) {
      var val = Ember.$("input[data-event_id='" + event_id + "']").val();
      if(val) {
        this.get('model').add_note(event_id, val);
      }
      Ember.$("input[data-event_id='" + event_id + "']").val("");
    },
    draw_charts: function() {
      this.draw_charts();
    }
  }
});