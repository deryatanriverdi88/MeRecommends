class Recommendation < ApplicationRecord
  belongs_to :user
  belongs_to :location
  has_many :likes, dependent: :destroy
end
