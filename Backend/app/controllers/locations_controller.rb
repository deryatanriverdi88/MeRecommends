class LocationsController < ApplicationController

  def index
    locations = Location.all
    render json: locations
  end

   def show
     locations = Location.find(params[:id])
     render json: locations
   end
end
