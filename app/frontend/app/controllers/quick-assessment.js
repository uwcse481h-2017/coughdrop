import modal from '../utils/modal';
import persistence from '../utils/persistence';
import stashes from '../utils/_stashes';

export default modal.ModalController.extend({
  opening: function() {
    this.reset();
  },
  reset: function() {
    this.set('description', '');
    this.set('tallies', []);
    this.set('totals', {
      correct: 0,
      incorrect: 0
    });
  },
  add_tally(correct) {
    var timestamp = Date.now() / 1000;
    var tallies = this.get('tallies');
    tallies.pushObject({
      timestamp: timestamp,
      correct: correct
    });
    if(correct) {
      this.set('totals.correct', this.get('totals.correct') + 1);
    } else {
      this.set('totals.incorrect', this.get('totals.incorrect') + 1);
    }
  },
  actions: {
    plus_minus: function(direction, key) {
      var val = parseInt(this.get(key), 10);
      if(direction == 'plus') {
        val++;
      } else {
        val--;
      }
      val = Math.max(0, val);
      this.set(key, val);
      this.set('totals.modified', true);
    },
    correct: function() {
      this.add_tally(true);
    },
    incorrect: function() {
      this.add_tally(false);
    },
    record_assessment: function() {
      var description = this.get('description') || (window.moment().format('MMMM Do YYYY, h:mm a'));
      var assessment = {
        start_timestamp: null,
        end_timestamp: null,
        description: description,
        tallies: this.get('tallies'),
        totals: this.get('totals')
      };
      if(persistence.get('online')) {
        var log = this.store.createRecord('log', {
          user_id: this.get('model.id'),
          assessment: assessment
        });
        var _this = this;
        log.save().then(function() {
          modal.close(true);
        }, function() { });
      } else {
        stashes.log_event({assessment: assessment}, this.get('model.id'));
        modal.close();
      }
    }
  }
});
