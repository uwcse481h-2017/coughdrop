class AddLogTypeToLogSessions < ActiveRecord::Migration
  def change
    add_column :log_sessions, :log_type, :string
    add_index :log_sessions, [:user_id, :log_type, :started_at]
  end
end
