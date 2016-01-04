class AddDeveloperKeyToDevice < ActiveRecord::Migration
  def change
    add_column :devices, :developer_key_id, :integer
  end
end
