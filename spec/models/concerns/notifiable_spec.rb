require 'spec_helper'

describe Notifiable, :type => :model do
  it "should have specs"
end

# module Notifiable
#   extend ActiveSupport::Concern
#   
#   def record_code
#     "#{self.class.to_s.underscore}_#{self.global_id}"
#   end
#   
#   # TODO: after create on board, auto-register author
#   # TODO: while linked to a user, auto-register linker
#   
#   def notify(notification_type)
#     Worker.schedule(Webhook, :notify_all, self.record_code, notification_type)
#   end
#   
#   def register_listener(user, options)
#     Webhook.register(user, self.record_code, options)
#   end
#   
#   def listeners
#     Webhook.where(:record_code => self.record_code)
#   end
#   
#   module ClassMethods
#     def notify_on(attributes, notification_type)
#       # TODO: ...
#     end
#   end
# end