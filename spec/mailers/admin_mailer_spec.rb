require "spec_helper"

describe AdminMailer, :type => :mailer do
  describe "message_sent" do
    it "should use the ENV recipient address" do
      m = ContactMessage.process_new({
        'email' => 'maisy@example.com',
        'subject' => 'asdf'
      })
      ENV['NEW_REGISTRATION_EMAIL'] = 'asdf@example.com'
      m = AdminMailer.message_sent(m.global_id)
      expect(m.subject).to eq('CoughDrop - "Contact Us" Message Received')
      expect(m.to).to eq(['asdf@example.com'])
    end
    
    it "should generate a message" do
      m = ContactMessage.process_new({
        'email' => 'maisy@example.com',
        'subject' => 'asdf'
      })
      ENV['NEW_REGISTRATION_EMAIL'] = 'asdf@example.com'
      m = AdminMailer.message_sent(m.global_id)
      expect(m.subject).to eq('CoughDrop - "Contact Us" Message Received')
      expect(m.to).to eq(['asdf@example.com'])
      html = message_body(m, :html)
      expect(html).to match(/Subject: asdf/)

      text = message_body(m, :text)
      expect(text).to match(/Subject: asdf/)
    end
  end
end