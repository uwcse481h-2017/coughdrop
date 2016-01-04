require 'spec_helper'

describe SecureSerialize, :type => :model do
  before(:each) do
    FakeRecord.paper_trail_options = nil
  end
  
  class FakeRecord
    include SecureSerialize
    attr_accessor :id
    attr_accessor :name
    attr_accessor :settings
    cattr_accessor :paper_trail_options
    cattr_accessor :serialize_column
    cattr_accessor :serializer
    cattr_accessor :after
    cattr_accessor :before
    def self.serialize(column, serializer)
      self.serialize_column = column
      self.serializer = serializer
    end
    def self.after_initialize(method)
      self.after = method
    end
    
    def self.before_validation(method)
      self.before = method
    end
    
    def read_attribute(column)
      self.settings
    end
    
    def settings_will_change!
      @settings_changed = true
    end
    
    def settings_changed?
      !!@settings_changed
    end
    
    secure_serialize :settings
  end

  describe "secure serialization" do
    it "should have a secure_column class attribute" do
      expect(FakeRecord.respond_to?(:secure_column)).to eq(true)
      expect(FakeRecord.secure_column).to eq(:settings)
    end
    
    it "should call :serialize properly" do
      expect(FakeRecord.serialize_column).to eq(:settings)
      expect(FakeRecord.serializer).to eq(SecureJson)
    end
    
    it "should register callbacks correctly" do
      expect(FakeRecord.after).to eq(:remember_secure_object_hash)
      expect(FakeRecord.before).to eq(:mark_changed_secure_object_hash)
    end
  end
  
  
  describe "paper_trail_for_secure_column?" do
    it "should not consider paper_trail if not configured" do
      r = FakeRecord.new
      expect(r.paper_trail_for_secure_column?).to eq(false)
    end
    
    it "should consider paper_trail if configured" do
      FakeRecord.paper_trail_options = {}
      r = FakeRecord.new
      expect(r.paper_trail_for_secure_column?).to eq(true)

      FakeRecord.paper_trail_options = {:only => ['hat', 'settings']}
      r = FakeRecord.new
      expect(r.paper_trail_for_secure_column?).to eq(true)

      FakeRecord.paper_trail_options = {:only => ['hat']}
      r = FakeRecord.new
      expect(r.paper_trail_for_secure_column?).to eq(false)
    end
  end

  describe "paper_trail updating" do
    it "should only remember the object if paper_trail enabled" do
      r = FakeRecord.new
      expect(r.paper_trail_for_secure_column?).to eq(false)
      r.remember_secure_object_hash
      expect(r.instance_variable_get('@secure_object_json')).to eq(nil)
      
      FakeRecord.paper_trail_options = {:only => ['hat', 'settings']}
      r = FakeRecord.new
      r.settings = {:a => 1}
      expect(r.paper_trail_for_secure_column?).to eq(true)
      r.remember_secure_object_hash
      expect(r.instance_variable_get('@secure_object_json')).to eq({:a => 1}.to_json)
    end
    
    it "should only mark changed paper_trail-enabled records" do
      r = FakeRecord.new
      expect(r.paper_trail_for_secure_column?).to eq(false)
      r.remember_secure_object_hash
      r.mark_changed_secure_object_hash
      expect(r.instance_variable_get('@settings_changed')).to eq(nil)
      
      FakeRecord.paper_trail_options = {:only => ['hat', 'settings']}
      r = FakeRecord.new
      expect(r.paper_trail_for_secure_column?).to eq(true)
      r.remember_secure_object_hash
      r.mark_changed_secure_object_hash
      expect(r.instance_variable_get('@settings_changed')).to eq(nil)

      r = FakeRecord.new
      expect(r.paper_trail_for_secure_column?).to eq(true)
      r.remember_secure_object_hash
      r.settings = {:a => 1}
      r.mark_changed_secure_object_hash
      expect(r.instance_variable_get('@settings_changed')).to eq(true)
      
      r = FakeRecord.new
      expect(r.paper_trail_for_secure_column?).to eq(true)
      r.remember_secure_object_hash
      r.settings_will_change!
      expect(r).not_to receive(:settings_will_change!)
      r.settings = {:a => 1}
      r.mark_changed_secure_object_hash
      expect(r.instance_variable_get('@settings_changed')).to eq(true)
    end
  end
end
