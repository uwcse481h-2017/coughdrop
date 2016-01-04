module JsonApi::BoardVersion
  extend JsonApi::Json
  
  TYPE_KEY = 'boardversion'
  DEFAULT_PAGE = 25
  MAX_PAGE = 50
  
  def self.build_json(version, args={})
    json = {}
    json['id'] = version.id
    json['action'] = version.event
    json['created'] = version.created_at.iso8601

    bucket = ENV['STATIC_S3_BUCKET'] || "coughdrop"
    if version.whodunnit
      if version.whodunnit.match(/^user:/)
        user_id = version.whodunnit.split(/:/)[1]
        user = User.find_by_path(user_id)
        if user
          user_json = JsonApi::User.as_json(user, :limited_identity => true)
          json['modifier'] = {
            'description' => user.user_name,
            'user_name' => user.user_name,
            'image' => user_json['avatar_url']
          }
        end
      elsif version.whodunnit.match(/^admin:/)
        json['modifier'] = {
          'description' => 'CoughDrop Admin',
          'image' => "https://www.mycoughdrop.com/images/logo-big.png"
        }
      end
      # TODO: this isn't highly performant, but is rarely used. We might could add 
      # object_changes text column to the versions table to get this same functionality, not sure.
      obj = version.next.reify rescue nil
      if obj && obj.settings && obj.settings['edit_description'] && obj.settings['edit_description']['notes'] && obj.settings['edit_description']['notes'].length > 0
        json['action'] = obj.settings['edit_description']['notes'].join(', ')
      end
    end
    json['modifier'] ||= {
      'description' => 'Unknown User',
      'image' => "https://s3.amazonaws.com/#{bucket}/avatars/avatar-0.png"
    }

    json
  end
end
