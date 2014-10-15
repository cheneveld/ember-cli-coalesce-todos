class TodosController < ApplicationController
	def index
		render json: Todo.all
	end


	def show
		@todo = Todo.find(params[:id])
		render json: @todo
	end

	def create
		todo = Todo.new(create_todo_params)

		if todo.save
			render json: todo
		else
			Rails.logger.debug("---> got something")
			Rails.logger.debug(todo.errors)
			raise "not implemented"
		end
	end

	def create_todo_params
		params.require(:todo).permit(:title, :description, :client_id, :client_rev, :user_id)
	end
end