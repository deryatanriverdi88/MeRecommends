class RecommendationSerializer < ActiveModel::Serializer
  attributes :id, :type_of, :description, :price_range, :rate, :place , :like
  belongs_to :location
  belongs_to :user
  
end
