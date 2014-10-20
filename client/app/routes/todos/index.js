import Ember from 'ember';
// import Todo from 'todos/models/todo';

export default Ember.Route.extend({
	needs: ['user'],

	model: function(){
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

            self.session.flush().then(function(models) {
                self.session.saveToStorage();
                self.get("controller").set("title", "");
                self.get("controller").set("description", "");
            }, function(error) {
                self.session.saveToStorage();
                
            });
		}
	}
});