module Renaming
  extend ActiveSupport::Concern
  
  def old_link?
    !!@old_link
  end
  
  def collision_error?
    !!@collision_error
  end 
  
  def record_type
    @type ||= self.class.record_type
  end

  def rename_to(to_key)
    @collision_error = nil
    from_key = (record_type == 'board' ? self.key : self.user_name)
    record = self
    if self.class.find_by_path(to_key)
      @collision_error = true
      return false
    end
    if record_type == 'board'
      old_prefix = from_key.split(/\//)[0]
      new_prefix = to_key.split(/\//)[0]
      return false if old_prefix != new_prefix
    end
    
    # - rename the actual key/users
    if record_type == 'board'
      self.key = to_key
    else
      self.user_name = to_key
    end
    self.save
    # - schedule an update to any references
    schedule(:rename_deep_links, from_key)
    OldKey.where(:type => record_type, :key => from_key).update_all(:record_id => record.global_id)
    if !OldKey.find_by(:type => record_type, :key => from_key)
      OldKey.create(:type => record_type, :key => from_key, :record_id => record.global_id)
    end
    true
  end
  
  def rename_deep_links(from_key)
    record = self
    to_key = (record_type == 'board') ? self.key : self.user_name
    raise "must be renamed already" if from_key == to_key
    
    if record_type == 'board'
      board_ids = record.settings['immediately_upstream_board_ids'] || []
      Board.find_all_by_global_id(board_ids).each do |board|
        changed = false
        (board.settings['buttons'] || []).each do |button|
          if button['load_board'] && button['load_board']['id'] == global_id && button['load_board']['key'] != to_key
            button['load_board']['key'] = to_key
            changed = true
          end
        end
        board.save if changed
      end
      UserBoardConnection.where(:board_id => record.id, :home => true).each do |ubc|
        user = ubc.user
        if user.settings && user.settings['preferences'] && user.settings['preferences']['home_board'] && user.settings['preferences']['home_board']['id'] == global_id && user.settings['preferences']['home_board']['key'] != to_key
          user.settings['preferences']['home_board']['key'] = to_key
          user.save
        end
      end
      LogSessionBoard.where(:board_id => record.id).each do |lsb|
        session = lsb.log_session
        changed = false
        (session.data['events'] || []).each do |event|
          if event['button'] && event['button']['board'] && event['button']['board']['id'] == record.global_id && event['button']['board']['key'] != to_key
            event['button']['board']['key'] = to_key
            changed = true
          end
        end
        session.save if changed
      end
    else
      klasses = [ButtonImage, ButtonSound, Board]
      klasses.each do |klass|
        klass.where(:user_id => record.id).each do |bi|
          if bi.settings['license'] && bi.settings['license']['author_url'].match(/#{from_key}$/)
            bi.settings['license']['author_url'] = bi.settings['license']['author_url'].sub(/#{from_key}$/, to_key)
            bi.save
          end
        end
      end
    end
    # TODO: things we can't currently get at easily for updating
    # Utterance.data['button_list'][idx]['board']['key']
    # ButtonImage.settings['license']['author_url']
    # ButtonSound.settings['license']['author_url']
    # LogSession.data['stats']['all_boards'][idx]['key']
    # LogSession.data['events'][idx]['action']['previous_key']['key']
    # LogSession.data['events'][idx]['action']['new_id']['key']
  end


  module ClassMethods
    def record_type
      @type ||= (self == Board ? 'board' : 'user')
    end
    
    def find_by_possibly_old_path(path)
      res = find_by_path(path)
      if !res
        key = OldKey.find_by(:type => record_type, :key => path)
        res = key && key.record
        res.instance_variable_set('@old_link', true) if res
      end
      res
    end
  end
end