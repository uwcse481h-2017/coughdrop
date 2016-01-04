require 'spec_helper'

describe UserBoardConnection, :type => :model do
  it "should always have a value for home" do
    u = UserBoardConnection.create
    expect(u.home).to eq(false)
    u.home = nil
    u.save
    expect(u.home).to eq(false)
  end
end
