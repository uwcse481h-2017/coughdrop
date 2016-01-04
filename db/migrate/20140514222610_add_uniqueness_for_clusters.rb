class AddUniquenessForClusters < ActiveRecord::Migration
  def change
    add_column :cluster_locations, :cluster_type, :string
    add_column :cluster_locations, :cluster_hash, :string
    add_index :cluster_locations, [:cluster_type, :cluster_hash], :unique => true
  end
end
