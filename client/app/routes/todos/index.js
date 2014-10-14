import Todo from 'todos/models/todo';

export default Ember.Route.extend({
	needs: ['user'],

	model: function(params){
		return this.modelFor('user').get('todos');
	},

	actions: {
		addTodo: function(){
			var self = this;
			var controller = this.get("controller");

			var todo = this.session.create('todo', {
				title: controller.get("title"),
				description: controller.get("description"),
				user: this.modelFor('user')
			});

			self.session.flush().then(function(){
				debugger
			}, function(){
				self.get("controller.model").removeObject(todo);				

			});
		}
	}
});