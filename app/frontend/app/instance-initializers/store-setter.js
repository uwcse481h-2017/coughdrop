import CoughDrop from '../app';

export default {
  name: 'store-setter',
  initialize: function(instance) {
    CoughDrop.store = instance.container.lookup('service:store');
  }
};

