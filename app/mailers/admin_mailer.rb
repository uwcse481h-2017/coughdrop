class AdminMailer < ActionMailer::Base
  include General
  default from: ENV['DEFAULT_EMAIL_FROM']
  layout 'email'
  
  def message_sent(message_id)
    @message = ContactMessage.find_by_global_id(message_id)
    if ENV['NEW_REGISTRATION_EMAIL'] && @message
      mail(to: ENV['NEW_REGISTRATION_EMAIL'], subject: "CoughDrop - \"Contact Us\" Message Received", reply_to: @message.settings['email'])
    end
  end
end
