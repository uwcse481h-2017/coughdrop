require 'spec_helper'

describe DeveloperKey, :type => :model do
  describe "generate_defaults" do
    it "should generate default values" do
      k = DeveloperKey.create
      expect(k.key).not_to eq(nil)
      expect(k.secret).not_to eq(nil)
    end
    
    it "should not override values" do
      k = DeveloperKey.create(:key => "abc", :secret => "asdfasdf")
      expect(k.key).to eq('abc')
      expect(k.secret).to eq('asdfasdf')
    end
  end
  
  describe "valid_uri?" do
    it "should match on out-of-band URI" do
      k = DeveloperKey.new(:redirect_uri => DeveloperKey.oob_uri)
      expect(k.valid_uri?(DeveloperKey.oob_uri)).to eq(true)
      expect(k.valid_uri?(nil)).to eq(false)
      expect(k.valid_uri?("http://www.google.com")).to eq(false)
    end
    
    it "should match by host on http/https URIs" do
      k = DeveloperKey.new(:redirect_uri => "http://www.example.com")
      expect(k.valid_uri?(DeveloperKey.oob_uri)).to eq(false)
      expect(k.valid_uri?("http://www.example.com/oauth/success")).to eq(true)
      expect(k.valid_uri?("https://www.example.com/oauth/success")).to eq(true)
      expect(k.valid_uri?("https://www.examplex.com/oauth/success")).to eq(false)
      expect(k.valid_uri?("https://example.com/oauth/success")).to eq(false)
    end
    
    it "should always fail if there is no redirect_uri set" do
      k = DeveloperKey.new
      expect(k.valid_uri?(DeveloperKey.oob_uri)).to eq(false)
      expect(k.valid_uri?(nil)).to eq(false)
      expect(k.valid_uri?("http://www.google.com")).to eq(false)
    end
  end
  
  describe "oob_uri" do
    it "should return the correct value" do
      expect(DeveloperKey.oob_uri).to eq("urn:ietf:wg:oauth:2.0:oob")
    end
  end
end
