class AddNonceToUtterances < ActiveRecord::Migration
  def change
    add_column :utterances, :nonce, :string
  end
end
