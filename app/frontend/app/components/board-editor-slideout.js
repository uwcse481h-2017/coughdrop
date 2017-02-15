import Ember from 'ember';
import InboundActions from '../../ember-component-inbound-actions/inbound-actions';

export default Ember.Component.extend(InboundActions, {
  toggleSlideoutService: Ember.inject.service('toggle-slideout-service'),
  init: function() {
    this._super();
    this.set('slideout', null); // This will eventually hold our slideout.
  },
  // Set up slideout element once the DOM has been built and elements are accessible.
  didInsertElement: function() {
    this._super();
    var self = this;
    // Create slideout that will move the board over when opened during editing mode.
    var newSlideout = new window.Slideout({
      'panel': Ember.$('#slideout-main-panel')[0],
      'menu': Ember.$('#menu')[0],
      'padding': 256,
      'tolerance': 70
    });


    // Append this to the component.
    this.set('slideout', newSlideout);

    // Set the content of the slideout to appear below the header.
    // When in edit-mode, the header is 70px wide.
    // TODO: make this a constant, or dynamically decide based on just the
    // edit header.
    Ember.$('#menu').css('padding-top', '70px');

    // TODO figure out how to access correct button.
    Ember.$('.remove-button').click(function(e) {
      self.get('removeButton')();
    });
  },
  // Open/close the slideout.
  toggleSlideout: function() {
    this.get('slideout').toggle();
  },
  // Handle subscription to the toggle-slideout-service
  subscribeToService: Ember.on('init', function() {
    this.get('toggleSlideoutService').on('toggleSlideout', this,  this.toggleSlideout);
  }),
  unsubscribeToService: Ember.on('willDestroyElement', function () {
    this.get('toggleSlideoutService').off('toggleSlideout', this, this.toggleSlideout);
  }),
  removeButton: function() {
    // TODO add logic to remove a button
    console.log('clicked worked');
  }
});
