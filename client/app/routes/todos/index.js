import Ember from 'ember';
// import Todo from 'todos/models/todo';

export default Ember.Route.extend({
  needs: ['user'],

  model: function() {
      return this.modelFor('user').get('todos');
  },

  actions: {
      addTodo: function() {
          var self = this;
          var controller = this.get("controller");

          this.session.create('todo', {
              title: controller.get("title"),
              description: controller.get("description"),
              user: this.modelFor('user')
          });

          self.get("controller").set("title", "");
          self.get("controller").set("description", "");

          self.session.flush().then(function() {
              Coalesce.EmberSession.saveToStorage(self.session);    
          }, function(error) {
              console.error(error);
              Coalesce.EmberSession.saveToStorage(self.session);
          });
      }
  }
});
