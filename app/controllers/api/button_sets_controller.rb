class Api::ButtonSetsController < ApplicationController
  extend ::NewRelic::Agent::MethodTracer
  before_filter :require_api_token
  
  def show
    board = Board.find_by_path(params['id'])
    button_set = board && board.board_downstream_button_set
    return unless exists?(button_set)
    allowed = false
    self.class.trace_execution_scoped(['button_set/board/permission_check']) do
      allowed = allowed?(board, 'view')
    end
    return unless allowed
    json = {}
    self.class.trace_execution_scoped(['button_set/board/json_render']) do
      json = JsonApi::ButtonSet.as_json(button_set, :wrapper => true, :permissions => @api_user)
    end
    render json: json.to_json
  end
end
