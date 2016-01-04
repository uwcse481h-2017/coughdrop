class CreateLogSessionBoards < ActiveRecord::Migration
  def change
    create_table :log_session_boards do |t|
      t.integer :log_session_id
      t.integer :board_id
      t.timestamps
    end
  end
end
