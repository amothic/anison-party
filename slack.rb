require "slack-notifier"
require "yaml"

config = YAML.load_file("config/config.yaml")
webhook_url = config[:slack][:webhook]
notifier = Slack::Notifier.new webhook_url, username: "anison-party"

metadata = Hash.new
pipe = open("./metadata/now_playing", "r+")
while true
  metadata.merge!(pipe.gets.scan(/(\w+)=(.*)/).map{|k, v| [k.to_sym, v.to_s]}.to_h)
  if metadata.has_key?(:artist) && metadata.has_key?(:title)
    sleep 10
    music_info = "今流れている曲は、#{metadata[:artist]}の#{metadata[:title]}だよ"
    notifier.ping music_info
    puts music_info
    metadata.delete(:artist)
    metadata.delete(:title)
  end
end
