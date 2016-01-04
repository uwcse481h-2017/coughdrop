require 'spec_helper'

describe Async, :type => :model do
  describe "object scheduling" do
    it "should not error on empty values" do
      u = User.create
      expect(u.schedule(nil)).to eq(nil)
      expect(Worker.scheduled?(User, :perform_action, {'id' => u.id, 'method' => nil, 'arguments' => []})).to be_falsey
    end
    
    it "should schedule events" do
      u = User.create
      u.schedule(:do_something, 1, 2, 3)
      expect(Worker.scheduled?(User, :perform_action, {'id' => u.id, 'method' => 'do_something', 'arguments' => [1,2,3]})).to be_truthy
    end
  end
  
  describe "class scheduling" do
    it "should not error on empty values" do
      expect(User.schedule(nil)).to eq(nil)
      expect(Worker.scheduled?(User, :perform_action, {'method' => nil, 'arguments' => []})).to be_falsey
    end
    
    it "should schedule events" do
      User.schedule(:do_something, 1, 2, 3)
      expect(Worker.scheduled?(User, :perform_action, {'method' => 'do_something', 'arguments' => [1,2,3]})).to be_truthy
    end
  end
  
  describe "perform_action" do
    it "should raise on invalid method" do
      expect{ User.perform_action({'method' => 'bad_method', 'arguments' => []}) }.to raise_error("method not found: User:bad_method")
    end
    
    it "should call class methods" do
      expect(User).to receive(:hippo).with(1,2,3).and_return("ok")
      expect(User.perform_action({'method' => 'hippo', 'arguments' => [1,2,3]})).to eq("ok")
    end
    
    it "should raise when the record isn't found" do
      expect(Rails.logger).to receive(:warn).with("expected record not found: User:5")
      User.perform_action({'id' => 5, 'method' => 'id', 'arguments' => []})
    end
    
    it "should call object methods" do
      u = User.create
      expect_any_instance_of(User).to receive(:hippo).with(1,2,3).and_return("ok")
      expect(User.perform_action({'id' => u.id, 'method' => 'hippo', 'arguments' => [1,2,3]})).to eq("ok")
    end
  end
end
