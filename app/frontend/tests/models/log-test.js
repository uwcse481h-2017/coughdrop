import DS from 'ember-data';
import Ember from 'ember';
import { test, moduleForModel } from 'ember-qunit';
import { describe, it, expect, beforeEach, afterEach, waitsFor, runs, stub } from 'frontend/tests/helpers/jasmine';
import { } from 'frontend/tests/helpers/ember_helper';
import CoughDrop from '../../app';

describe('Log', function() {
  describe("minutes", function() {
    it("should not error on empty value", function() {
      var log = CoughDrop.store.createRecord('log', {});
      expect(log.get('minutes')).toEqual(0);
    });
    it("should return filename if found in URL path, ignoring query params", function() {
      var log = CoughDrop.store.createRecord('log', {duration: 100});
      expect(log.get('minutes')).toEqual(2);
      log.set('duration', 300);
      expect(log.get('minutes')).toEqual(5);
    });
  });
});
