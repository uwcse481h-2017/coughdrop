class UserBoardConnection < ActiveRecord::Base
  before_save :generate_defaults
  belongs_to :board
  belongs_to :user
  
  def generate_defaults
    self.home ||= false
    true
  end
end
