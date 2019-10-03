class User < ApplicationRecord
  has_many :recommendations, dependent: :destroy
  has_many :locations, through: :recommendations
end
