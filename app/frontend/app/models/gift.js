import Ember from 'ember';
import DS from 'ember-data';
import CoughDrop from '../app';
import i18n from '../utils/i18n';

CoughDrop.Gift = DS.Model.extend({
  code: DS.attr('string'),
  duration: DS.attr('string'),
  seconds: DS.attr('number')
});

export default CoughDrop.Gift;