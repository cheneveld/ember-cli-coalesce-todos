class TodoSerializer < ActiveModel::Serializer
	attributes :id, :title, :description, :client_id, :client_rev

	has_one :user, embed: :object
end