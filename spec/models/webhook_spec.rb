require 'spec_helper'

describe Webhook, :type => :model do
  describe "register" do
    it "should register the webhook" do
      u = User.create
      expect(Webhook.count).to eq(0)
      Webhook.register(u, u, {:callback => 'http://www.example.com/ping', :notification_type => 'swinging'})
      expect(Webhook.count).to eq(1)
    end
    
    it "should register an internal webhook" do
      u = User.create
      expect(Webhook.count).to eq(0)
      expect(Webhook.register(u, u, {:callback => 'push_notification', :notification_type => 'swinging'})).to eq(nil)
      expect(Webhook.count).to eq(0)
      Webhook.register_internal(u, u, {:callback => 'push_notification', :notification_type => 'swinging'})
      expect(Webhook.count).to eq(1)
    end
    
    it "should return a token" do
      u = User.create
      expect(Webhook.count).to eq(0)
      t = Webhook.register(u, u, {:callback => 'http://www.example.com/ping', :notification_type => 'swinging'})
      expect(t).not_to eq(nil)
      expect(t).to be_is_a(String)
      expect(Webhook.count).to eq(1)
    end
    
    it "should log repeat registrations only once" do
      u = User.create
      expect(Webhook.count).to eq(0)
      t = Webhook.register(u, u, {:callback => 'http://www.example.com/ping', :notification_type => 'swinging'})
      t2 = Webhook.register(u, u, {:callback => 'http://www.example.com/ping', :notification_type => 'swinging'})
      t3 = Webhook.register(u, u, {:callback => 'http://www.example.com/ping', :notification_type => 'swinging'})
      expect(t).not_to eq(nil)
      expect(t).to be_is_a(String)
      expect(t).to eq(t2)
      expect(t).to eq(t3)
      expect(Webhook.count).to eq(1)
      h = Webhook.last
      expect(h.settings['notifications']['swinging'].length).to eq(1)
      expect(h.settings['notifications']['swinging'][0]['token']).to eq(t)
      expect(h.settings['notifications']['swinging'][0]['callback']).to eq("http://www.example.com/ping")
    end
  end
  
  describe "notify_all" do
    it "should find all associated webhooks and call notify" do
      hook1 = {id: '1234'}
      hook2 = {id: '2345'}
      expect(hook1).to receive(:notify).with('bacon')
      expect(hook2).to receive(:notify).with('bacon')
      expect(Webhook).to receive(:where).with(:record_code => 'OpenStruct:abcdefg').and_return([hook1, hook2])
      expect(OpenStruct).to receive(:find_by).with(:id => 'abcdefg').and_return(nil)
      r = OpenStruct.new(:id => "abcdefg")
      expect(Webhook.get_record_code(r)).to eq('OpenStruct:abcdefg')
      Webhook.notify_all(r, 'bacon')
      expect(Worker.scheduled?(Webhook, 'perform_action', {'method' => 'notify_all_with_code', 'arguments' => ['OpenStruct:abcdefg', 'bacon', nil]})).to eq(true)
      Worker.process_queues
    end
    
    it "should find default internal callbacks and trigger them" do
      r = OpenStruct.new(:id => "abcdefg")
      listener1 = OpenStruct.new(:id => 'qwer')
      listener2 = OpenStruct.new(:id => 'asdf')
      
      expect(OpenStruct).to receive(:find_by).with(:id => 'abcdefg').and_return(r)
      expect(r).to receive(:default_listeners).with('chicken').and_return(['OpenStruct:qwer', 'OpenStruct:asdf'])
      expect(OpenStruct).to receive(:find_by).with(:id => 'qwer').and_return(listener1)
      expect(OpenStruct).to receive(:find_by).with(:id => 'asdf').and_return(listener2)
      expect(listener1).to receive(:handle_notification).with('chicken', r, nil)
      expect(listener2).to receive(:handle_notification).with('chicken', r, nil)

      expect(Webhook.get_record_code(r)).to eq('OpenStruct:abcdefg')
      Webhook.notify_all(r, 'chicken')
      expect(Worker.scheduled?(Webhook, 'perform_action', {'method' => 'notify_all_with_code', 'arguments' => ['OpenStruct:abcdefg', 'chicken', nil]})).to eq(true)
      Worker.process_queues
    end
  end
   
  describe "notify" do
    it "should post to external services for external callbacks" do
      u = User.create
      token = Webhook.register(u, u, {:callback => 'http://www.example.com/ping', :notification_type => 'swinging'})
      w = Webhook.last
      expect(Typhoeus).to receive(:post) do |url, args|
        expect(url).to eq('http://www.example.com/ping')
        expect(args[:body][:webhook_token]).to eq(token)
      end
      w.notify('swinging')
    end
    
    it "should handle internal service callbacks as well" do
      u = User.create
      token = Webhook.register_internal(u, u, {:callback => 'push_notification', :notification_type => 'swinging'})
      w = Webhook.last
      expect(Typhoeus).not_to receive(:post)
      expect(w).to receive(:internal_notify).with('push_notification', 'swinging')
      w.notify('swinging')
    end
  end
end
