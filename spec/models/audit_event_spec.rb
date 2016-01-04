require 'spec_helper'

describe AuditEvent, :type => :model do
  describe "generate_summary" do
    it "should generate a summary" do
      e = AuditEvent.new(:user_key => "bob")
      e.generate_summary
      expect(e.summary).to eq("bob:  ")
      
      e = AuditEvent.new(:user_key => "bob")
      e.data = {
        'type' => 'console',
        'command' => 'do something'
      }
      e.generate_summary
      expect(e.summary).to eq("bob: console do something")
    end
  end
  
  describe "log_command" do
    it "should log events" do
      expect(AuditEvent.log_command('fred', {})).to be_is_a(AuditEvent)
      e = AuditEvent.log_command('fred', {'type' => 'run'})
      expect(e.id).not_to eq(nil)
      expect(e.user_key).to eq('fred')
      expect(e.data['type']).to eq('run')
    end
  end
end
