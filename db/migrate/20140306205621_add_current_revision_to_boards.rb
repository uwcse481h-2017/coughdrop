class AddCurrentRevisionToBoards < ActiveRecord::Migration
  def change
    add_column :boards, :current_revision, :string
  end
end
