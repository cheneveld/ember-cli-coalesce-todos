class TodoSerializer < ActiveModel::Serializer
	attributes :id, :title, :description, :client_id, :client_rev#, :user_id

	has_one :user, embed: :ids
end