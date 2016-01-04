require 'spec_helper'

describe JsonApi::Token do
  describe "as_json" do
    it "should return correct attributes" do
      d = Device.create
      d.generate_token!
      u = User.new(user_name: 'fred')
      hash = JsonApi::Token.as_json(u, d)
      expect(hash.keys.sort).to eq(['access_token', 'token_type', 'user_name'])
      expect(hash['access_token']).to eq(d.token)
      expect(hash['token_type']).to eq('bearer')
      expect(hash['user_name']).to eq('fred')
    end
  end
end
