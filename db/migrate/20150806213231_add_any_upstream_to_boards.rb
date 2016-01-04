class AddAnyUpstreamToBoards < ActiveRecord::Migration
  def change
    add_column :boards, :any_upstream, :boolean
    add_index :boards, [:popularity, :any_upstream]
  end
end
