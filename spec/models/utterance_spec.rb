require 'spec_helper'

describe Utterance, :type => :model do
  it "should generate defaults" do
    u = Utterance.new
    u.generate_defaults
    expect(u.data).not_to eq(nil)
    expect(u.data['image_url']).not_to eq(nil)
  end
  
  describe "process_params" do
    it "should error without a user" do
      expect{ Utterance.process_new({}, {}) }.to raise_error("user required")
    end
    it "should process parameters" do
      user = User.create
      u = Utterance.process_new({:button_list => [{label: 'ok'}], :sentence => 'abc'}, {:user => user})
      expect(u.data['button_list']).to eq([{'label' => 'ok'}])
      expect(u.data['sentence']).to eq('abc')
      expect(u.user).to eq(user)
    end
  end
  
  describe "generate_preview" do
    it "should generate a preview" do
      button_list = [
        {'label' => 'hat', 'image' => 'http://www.example.com/pib.png'},
        {'label' => 'cat', 'image' => 'http://www.example.com/pib.png'},
        {'label' => 'scat', 'image' => 'http://www.example.com/pic.png'}
      ]
      u = Utterance.create(:data => {
        'button_list' => button_list
      })
      expect(SentencePic).to receive(:generate).with(u).and_return("http://www.example.com/pid.png")
      Worker.process_queues
#      expect(u.reload.data['large_image_url']).to eq("http://www.example.com/pid.png")
    end
  end
end
