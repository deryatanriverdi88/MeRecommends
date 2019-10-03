class UsersController < ApplicationController

def index
  users = User.all
  render json: users
end

 def show
   user = User.find(params[:id])
   render json: user
 end

 def create
       render json: User.create(user_params)
   end

   def update
       user = User.find(params[:id])
       user.update(user_params)
       render json: user
   end

   def destroy
     user = User.find(params[:id])
     user.destroy
     render json: user
   end

   private
   def user_params
       params.permit(:name, :username)
   end

end
