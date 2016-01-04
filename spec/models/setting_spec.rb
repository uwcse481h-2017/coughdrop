require 'spec_helper'

describe Setting, :type => :model do
  describe "set" do
    it "should set the value" do
      Setting.set('abc', 'qwe')
      expect(Setting.find_by(:key => 'abc').value).to eq('qwe')
    end
  end
  
  describe "get" do
    it "should return value if found" do
      Setting.create(:key => "abc", :value => "qwe")
      expect(Setting.get('abc')).to eq('qwe')
    end
    
    it "should return nil if not found" do
      expect(Setting.get('abc')).to eq(nil)
    end
  end
  
end
