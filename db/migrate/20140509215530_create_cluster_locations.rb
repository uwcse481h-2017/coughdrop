class CreateClusterLocations < ActiveRecord::Migration
  def change
    create_table :cluster_locations do |t|
      t.integer :user_id
      t.text :data
      t.timestamps
    end
    add_column :log_sessions, :ip_cluster_id, :integer
    add_column :log_sessions, :geo_cluster_id, :integer
  end
end
