import Ember from 'ember';
import InboundActions from '../../ember-component-inbound-actions/inbound-actions';

export default Ember.Component.extend(InboundActions, {
  init: function() {
    this._super();
    this.set('slideout', null); // This will eventually hold our slideout.
  },

  // Set up slideout element once the DOM has been built and elements are accessible.
  didInsertElement: function() {
    this._super();

    // Create slideout that will move the board over when opened during editing mode.
    var newSlideout = new window.Slideout({
      'panel': Ember.$('.board')[0],
      'menu': Ember.$('#menu')[0],
      'padding': 256,
      'tolerance': 70
    });

    // Append this to the component.
    this.set('slideout', newSlideout);

    // Set the content of the slideout to appear below the header.
    var headerHeight = Ember.$('header').css('height');
    Ember.$('#menu').css('padding-top', headerHeight);
  },
  actions: {
    // Open/close the slideout. Can be accessed by controllers of parent components
    // using InboundActions.
    toggleSlideout: function() {
      this.get('slideout').toggle();
    }
  }
});
