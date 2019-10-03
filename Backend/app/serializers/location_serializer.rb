class LocationSerializer < ActiveModel::Serializer
  attributes :id, :name, :state
  has_many :recommendations
  has_many :users, through: :recommendations
end
