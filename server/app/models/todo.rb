class Todo < ActiveRecord::Base
	attr_accessor :client_id, :client_rev
	belongs_to :user
end
