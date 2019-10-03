class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :username
  has_many :recommendations
  has_many :locations, through: :recommendations
end
