class AddNoteCountToLogSessions < ActiveRecord::Migration
  def change
    add_column :log_sessions, :has_notes, :boolean
    add_index :log_sessions, [:user_id, :log_type, :has_notes, :started_at], :name => "log_sessions_noted_index"
  end
end
