import Ember from 'ember';

export default Ember.Component.extend({
  // Set up slideout element once the DOM has been built and elements are accessible.
  didInsertElement() {
    this._super();

    // Create slideout that will move the board over when opened during editing mode.
    var slideout = new window.Slideout({
      'panel': Ember.$('.board')[0],
      'menu': Ember.$('#menu')[0],
      'padding': 256,
      'tolerance': 70
    });

    // Set the content of the slideout to appear below the header.
    var headerHeight = Ember.$('header').css('height');
    Ember.$('#menu').css('padding-top', headerHeight);


    // Initialize the slideout toggle action for the slideout toggle button.
    Ember.$('.toggle-slideout-button').on('click', function() {
        slideout.toggle();
    });
  },
  actions: {
    enableSlideout: function() {

    },
    disableSlideout: function() {

    }
  }
});
