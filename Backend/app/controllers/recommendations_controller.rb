class RecommendationsController < ApplicationController

  def index
    recommendations = Recommendation.all
    render json: recommendations
  end

   def show
     recommendation = Recommendation.find(params[:id])
     render json: recommendation
   end

   def create
         render json: Recommendation.create(recommedation_params)
   end

     def update
         recommendation = Recommendation.find(params[:id])
         recommendation.update(recommedation_params)
         render json: recommendation
     end

     private
     def recommedation_params
         params.permit(:user_id, :location_id, :type_of, :place, :rate, :description, :price_range)
     end

end
