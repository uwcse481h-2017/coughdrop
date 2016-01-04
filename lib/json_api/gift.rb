module JsonApi::Gift
  extend JsonApi::Json
  
  TYPE_KEY = 'gift'
  DEFAULT_PAGE = 25
  MAX_PAGE = 50
    
  def self.build_json(gift, args={})
    json = {}
    json['id'] = gift.code
    json['code'] = gift.code
    json['duration'] = gift.duration
    json['seconds'] = gift.settings['seconds_to_add'].to_i
    
    if args[:permissions]
      json['permissions'] = gift.permissions_for(args[:permissions])
    end
    json
  end
end