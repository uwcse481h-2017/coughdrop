import CoughDrop from '../app';

export default {
  name: 'defer_readiness',
  initialize: function(container, app) {
    if(!window.cough_drop_readiness) {
      CoughDrop.app = app;
      app.deferReadiness();
    }
  }
};
