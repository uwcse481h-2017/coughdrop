require 'spec_helper'

describe JsonApi::Organization do
  it "should have defined pagination defaults" do
    expect(JsonApi::Organization::TYPE_KEY).to eq('organization')
    expect(JsonApi::Organization::DEFAULT_PAGE).to eq(15)
    expect(JsonApi::Organization::MAX_PAGE).to eq(25)
  end

  describe "build_json" do
    it "should not include unlisted settings" do
      o = Organization.create
      o.settings['hat'] = 'black'
      expect(JsonApi::Organization.build_json(o).keys).not_to be_include('hat')
    end
    
    it "should return appropriate attributes" do
      o = Organization.create(:settings => {'name' => 'my org'})
      ['id', 'name'].each do |key|
        expect(JsonApi::Organization.build_json(o).keys).to be_include(key)
      end
    end
    
    it "should include permissions if permissions are requested" do
      o = Organization.create
      u = User.create
      expect(JsonApi::Organization.build_json(o, :permissions => u)['permissions']).to eq({'user_id' => u.global_id})
    end
    
    it "should include license information if edit permissions are allowed" do
      o = Organization.create(:settings => {'total_licenses' => 4})
      u = User.create
      o.add_manager(u.user_name, true)
      u.reload
      res = JsonApi::Organization.build_json(o, :permissions => u)
      expect(res['created']).not_to eq(nil)
      expect(res['allotted_licenses']).to eq(4)
      expect(res['used_licenses']).to eq(0)
    end
    
  end
end
