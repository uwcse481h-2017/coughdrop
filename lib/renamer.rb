module Renamer
  def self.rename_user(user_id, new_user_name)
    # error if new_user_name already in use
    # rename the user
    # create a temporary redirect object for the prior user_name
  end
  
  def self.rename_board(board_id, new_board_key)
    # error if new_board_key already in use
    # rename the board
    # create a temporary redirect object for the prior board_key
    # update any users with this board as their home_board
    # update any users with this board in the all_home_boards
    # update any boards with this board as a button link
    # update any log sessions with this board references (ick)
    # TODO: anywhere else boards are referenced by key?
  end
end