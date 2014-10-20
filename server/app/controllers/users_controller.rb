class UsersController < ApplicationController
	def index
		render json: User.all
	end

	def show
		@user = User.find(params[:id])
		render json: @user
	end

	def create
		user = User.new(create_user_params)

		if user.save
			render json: user
		else
			raise "not implemented"
		end
	end

	def update
		user = User.find(params[:id])

		if user.update(create_user_params)
			render json: user
		else
			raise "not implemented"
		end
	end

	def create_user_params
		params.require(:user).permit(:name, :client_id, :client_rev)
	end
end
