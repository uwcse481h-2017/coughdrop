class CreateOldKeys < ActiveRecord::Migration
  def change
    create_table :old_keys do |t|
      t.string :record_id
      t.string :type
      t.string :key
      t.timestamps
    end
    add_index :old_keys, [:type, :key]
  end
end
