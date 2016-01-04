import Ember from "ember";
import DS from "ember-data";
import persistence from '../utils/persistence';

export default DS.RESTAdapter.extend({
  namespace: 'api/v1'
}, persistence.DSExtend);