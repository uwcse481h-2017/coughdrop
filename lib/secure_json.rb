class SecureJson
  def self.load(str)
    return nil unless str
    salt, secret = str.split(/--/, 2)
    JSON.load(Security.decrypt(secret, salt, "secure_json"))
  end
  
  def self.dump(obj)
    secret, salt = Security.encrypt(JSON.dump(obj), "secure_json")
    salt + "--" + secret
  end
end
