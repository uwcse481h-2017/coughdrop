class AddNoncesToImagesAndSounds < ActiveRecord::Migration
  def change
    add_column :button_images, :nonce, :string
    add_column :button_sounds, :nonce, :string
    ButtonImage.update_all(:nonce => "legacy")
    ButtonSound.update_all(:nonce => "legacy")
  end
end
