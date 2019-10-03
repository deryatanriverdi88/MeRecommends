class CreateRecommendations < ActiveRecord::Migration[6.0]
  def change
    create_table :recommendations do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.belongs_to :location, null: false, foreign_key: true
      t.string :type_of
      t.string :description
      t.string :price_range
      t.integer :rate
      t.string :place
      t.integer :like, :default => 0

      t.timestamps
    end
  end
end
