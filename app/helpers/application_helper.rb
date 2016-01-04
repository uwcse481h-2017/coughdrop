module ApplicationHelper
  def pretty_loader
    request.path == '/'
  end
end
