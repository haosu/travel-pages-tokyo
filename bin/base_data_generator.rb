require 'json'

module BaseDataGenerator
  def self.generate(dir)
    files = Dir["#{dir}/*.MOV"]

    video_data = []

    files.each do |video_path|
      video_data << { video_path: video_path }
    end

     File.open('videos.json', 'w') do |file|
       video_hash = { videos: video_data }
       file.write(JSON.pretty_generate(video_hash))
     end
  end
end
