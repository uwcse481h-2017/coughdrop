class AddUniqueIndexForDeveloperKey < ActiveRecord::Migration
  def change
    add_index :developer_keys, [:key], :unique => true
  end
end
