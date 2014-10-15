class UserSerializer < ActiveModel::Serializer
	attributes :id, :name, :client_id, :client_rev
	has_many :todos, embed: :ids
end