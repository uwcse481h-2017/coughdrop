import DS from 'ember-data';
import Ember from 'ember';
import { test, moduleForModel } from 'ember-qunit';
import { describe, it, expect, beforeEach, afterEach, waitsFor, runs, stub } from 'frontend/tests/helpers/jasmine';
import { } from 'frontend/tests/helpers/ember_helper';
import CoughDrop from '../../app';

describe('User', function() {
  describe("avatar_url_with_fallback", function() {
    it("should key off avatar_url if defined", function() {
      var u = CoughDrop.store.createRecord('user', {avatar_url: "http://pic.example.com"});
      expect(u.get('avatar_url_with_fallback')).toEqual("http://pic.example.com");
    });
    it("should automatically check for locally-stored avatar data-uri on load", function() {
      var user = CoughDrop.store.createRecord('user');
      user.didLoad();
      expect(user.get('checked_for_data_url')).toEqual(true);
    });
  });
  
  describe("registration", function() {
    it("should clear password on successful registration");
  });
});
