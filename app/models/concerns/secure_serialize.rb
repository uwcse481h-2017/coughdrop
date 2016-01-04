module SecureSerialize
  extend ActiveSupport::Concern
  
  def paper_trail_for_secure_column?
    @for_secure ||= !!(self.class.respond_to?(:paper_trail_options) && self.class.paper_trail_options && 
          (!self.class.paper_trail_options[:only] || self.class.paper_trail_options[:only].include?(self.class.secure_column.to_s)))
  end
  
  # TODO: this is not very efficient, and I've heard rumors it was getting
  # folded into active_record by default anyway... Or, it wouldn't
  # be that hard to just replace serialize completely with some before and
  # after calls...
  def remember_secure_object_hash
    if paper_trail_for_secure_column?
      @secure_object_json = read_attribute(self.class.secure_column).to_json
    end
    true
  end
  
  # If the serialized data has changed since initialize and paper_trail
  # is configured, then we need to manually mark the column as dirty
  # to make sure a proper paper_trail is maintained
  def mark_changed_secure_object_hash
    if paper_trail_for_secure_column? && !send("#{self.class.secure_column}_changed?")
      json = read_attribute(self.class.secure_column).to_json
      if json != @secure_object_json
        send("#{self.class.secure_column}_will_change!")
      end
    end
    true
  end

  module ClassMethods
    def secure_serialize(column)
      raise "only one secure column per record! (yes I'm lazy)" if self.respond_to?(:secure_column) && self.secure_column
      serialize column, SecureJson
      cattr_accessor :secure_column
      self.secure_column = column
      after_initialize :remember_secure_object_hash
      before_validation :mark_changed_secure_object_hash
    end
  end
end