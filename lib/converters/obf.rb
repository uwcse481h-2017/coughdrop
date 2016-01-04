module Converters::OBF
  def self.to_coughdrop(obf, opts)
    Converters::CoughDrop.from_obf(obf, opts)
  end
  
  def self.from_coughdrop(board, dest_path)
    Converters::CoughDrop.to_obf(board, dest_path)
  end
  
  def self.to_pdf(obf, dest_path)
    OBF::PDF.from_obf(obf, dest_path)
  end
  
  def self.to_png(obf, dest_path)
    OBF::PNG.from_obf(obf, dest_path)
  end
end