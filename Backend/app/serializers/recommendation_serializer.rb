class RecommendationSerializer < ActiveModel::Serializer
  attributes :id, :type_of, :description, :price_range, :rate, :place
  belongs_to :location
  belongs_to :user
  has_many :likes
end
