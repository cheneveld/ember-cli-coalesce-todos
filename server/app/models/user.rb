class User < ActiveRecord::Base
	attr_accessor :client_id, :client_rev
	has_many :todos
end
