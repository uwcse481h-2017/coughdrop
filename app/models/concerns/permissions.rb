module Permissions
  extend ActiveSupport::Concern
  
  included do
    cattr_accessor :permissions_lookup
    self.permissions_lookup = []
  end
  
  def allows?(user, action)
    self.class.permissions_lookup.each do |actions, block|
      next unless actions.include?(action.to_s)
      next if block.arity == 1 && !user
      res = instance_exec(user, &block)
      return true if res == true
    end
    false
  end
  
  def permissions_for(user)
    all_permissions = []
    permissions_lookup.each{|actions, block| all_permissions += actions }
    all_permissions = all_permissions.uniq.sort
    granted_permissions = {
      'user_id' => (user && user.global_id)
    }.with_indifferent_access
    self.class.permissions_lookup.each do |actions, block|
      already_granted = granted_permissions.keys
      next if block.arity == 1 && !user
      next if actions - already_granted == []
      if instance_exec(user, &block)
        actions.each do |action|
          granted_permissions[action] = true
        end
      end
    end
    granted_permissions
  end
  
  module ClassMethods
    def add_permissions(*actions, &block)
      self.permissions_lookup << [actions.map(&:to_s), block]
    end
  end
end