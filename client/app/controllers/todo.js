import Ember from 'ember';

export default Ember.ObjectController.extend({
    isEditing: false,
    actions: {
        editTodo: function () {
            this.set('isEditing', true);
        },
        acceptChanges: function () {         

            if (this.get('isEditing')) {
                this.set('isEditing', false);
                this.send('flush');
                
            } else {
                this.send('removeTodo');
            }
        },
        removeTodo: function () {
            var self = this;
            var todo = this.get('model');

            //pull the user model out of the collection
            self.get('parentController.content').removeObject(todo);

            //delete it from coalesce
            self.session.deleteModel(todo);

            self.session.flush().then(function() {
                console.log("Todo::removeTodo: flush done");
            }, function(error) {
                console.error("Todo::removeTodo: flush error", error);
            });
        }
    }
});