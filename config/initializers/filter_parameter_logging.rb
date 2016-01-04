# Be sure to restart your server when you modify this file.

# Configure sensitive parameters which will be filtered from the log file.
Rails.application.config.filter_parameters += [:password, :access_token, :board, :user, :log, :message, :image, :sound, :utterance]
# TODO: do a real audit once live to make sure nothing bad is showing up