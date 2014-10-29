import Ember from 'ember';

export default Ember.ObjectController.extend({
    isEditing: false,
    actions: {
        editUser: function () {
            this.set('isEditing', true);
        },
        acceptChanges: function () {         

            if (this.get('isEditing')) {
                this.set('isEditing', false);
                this.send('flush');
                
            } else {
                this.send('removeUser');
            }
        },
        removeUser: function () {
            var self = this;
            var user = this.get('model');

            //pull the user model out of the collection
            self.get('parentController.content').removeObject(user);

            //delete it from coalesce
            self.session.deleteModel(user);

            self.session.flush().then(function() {
                console.log("User::removeUser: flush done");
            }, function(error) {
                debugger
                console.error("Todo::removeUser: flush error", error);

            });
        }
    }
});