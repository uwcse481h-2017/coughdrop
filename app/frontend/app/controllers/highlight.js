import Ember from 'ember';
import modal from '../utils/modal';
import scanner from '../utils/scanner';

export default modal.ModalController.extend({
  opening: function() {
    modal.highlight_controller = this;
    scanner.setup(this);
  },
  closing: function() {
    modal.highlight_controller = null;
  },
  compute_styles: function() {
    var opacity = "0.3";
    var display = this.get('model.overlay') ? '' : 'display: none;';
    if(this.get('model.clear_overlay')) {
      opacity = "0.0";
    }
    var header_height = Ember.$("header").outerHeight();
    var top = this.get('model.top');
    var bottom = this.get('model.bottom');
    this.set('model.top_style', new Ember.Handlebars.SafeString(display + "z-index: 9; position: absolute; top: -" + header_height + "px; left: 0; background: #000; opacity: " + opacity + "; width: 100%; height: " + top + "px;"));
    this.set('model.left_style', new Ember.Handlebars.SafeString(display + "z-index: 9; position: absolute; top: " + (top - header_height) + "px; left: 0; background: #000; opacity: " + opacity + "; width: " + this.get('model.left') + "px; height: " + this.get('model.height') + "px;"));
    this.set('model.right_style', new Ember.Handlebars.SafeString(display + "z-index: 9; position: absolute; top: " + (top - header_height) + "px; left: calc(" + this.get('model.left') + "px + " + this.get('model.width') + "px); background: #000; opacity: " + opacity + "; width: calc(100% - " + this.get('model.left') + "px - " + this.get('model.width') + "px); height: " + this.get('model.height') + "px;"));
    this.set('model.bottom_style', new Ember.Handlebars.SafeString(display + "z-index: 9; position: absolute; top: " + (bottom - header_height) + "px; left: 0; background: #000; opacity: " + opacity + "; width: 100%; height: 5000px;"));
    this.set('model.highlight_style', new Ember.Handlebars.SafeString("z-index: 10; position: absolute; top: " + (top - header_height) + "px; left: " + this.get('model.left') + "px; width: " + this.get('model.width') + "px; height: " + this.get('model.height') + "px; border: 4px solid #f00; cursor: pointer;"));
  }.observes('model.left', 'model.top', 'model.width', 'model.height', 'model.bottom', 'model.right', 'model.overlay'),
  actions: {
    select: function() {
      if(this.get('model.defer')) {
        this.get('model.defer').resolve();
      }
      if(!this.get('model.prevent_close')) {
        modal.close();
      }
    },
    close: function() {
      if(this.get('model.select_anywhere')) { // whole-screen is giant switch
        this.send('model.select');
      } else {
        if(this.get('model.defer')) {
          this.get('model.defer').reject();
        }
        if(!this.get('model.prevent_close')) {
          modal.close();
        }
      }
    },
    opening: function() {
      var template = this.get('templateName') || this.get('renderedName') || this.constructor.toString().split(/:/)[1];
      var settings = modal.settings_for[template] || {};
      var controller = this;
      modal.last_controller = controller;
      controller.set('model', settings);
      if(controller.opening) {
        controller.opening();
      }
    },
    closing: function() {
    }
  }
});
