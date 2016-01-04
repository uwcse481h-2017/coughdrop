class LogSessionBoard < ActiveRecord::Base
  belongs_to :board
  belongs_to :log_session
end
