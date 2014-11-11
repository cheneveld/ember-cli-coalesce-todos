import Ember from 'ember';
// import Todo from 'todos/models/todo';

export default Ember.Route.extend({
    needs: ['user'],

    model: function() {
        return this.modelFor('user').get('todos');
    },

    actions: {
        addTodo: function() {
            var controller = this.get("controller");

            var user = this.modelFor('user');
            
            this.session.create('todo', {
                title: controller.get("title"),
                description: controller.get("description"),
                user: user
            });

            this.get("controller").set("title", "");
            this.get("controller").set("description", "");

            this.session.flush().then(function() {
                console.log("Todo::addTodo: flush done");
            }, function(error) {
                console.error("Todo::addTodo: flush error", error);
            });
        }
    }
});
