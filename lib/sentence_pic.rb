require 'tempfile'
module SentencePic
  PER_ROW=6
  def self.generate(utterance)
    raise "utterance must be saved first" unless utterance && utterance.id
    images = {}
    return unless utterance.data['button_list']
    utterance.data['button_list'].map{|b| b['image'] }.uniq.each do |url|
      filename = OBF::Utils.save_image({'url' => url})
      images[url] = filename
    end
    image_commands = []
    utterance.data['button_list'].each do |button|
      filename = images[button['image']]
      image_commands << "-label \"#{(button['label'] || button['vocalization'] || '').gsub("\"", "\\\"")}\" #{filename}"
    end
    montage = OBF::Utils.temp_path('montage') + '.png'
    `montage #{image_commands.join(' ')} -tile #{PER_ROW}x -shadow -pointsize 16 -background white -geometry 70x70+3+10 #{montage}`
    preview = OBF::Utils.temp_path('preview') + '.png'
    if image_commands.length > PER_ROW
      `convert #{montage} -gravity top -extent 460x230 #{preview}`
    else
      `convert #{montage} -gravity center -extent 460x230 #{preview}`
    end
    key = Security.sha512(utterance.id.to_s, 'utterance_id')[0, 25]
    remote_path = "sentences/#{utterance.id}/#{key}/preview.png"
    url = Uploader.remote_upload(remote_path, preview, 'image/png')
    url
  end
end