import Ember from 'ember';

export default Ember.ObjectController.extend({
    isEditing: false,
    actions: {
        editUser: function () {
            this.set('isEditing', true);
        },
        acceptChanges: function () {
            this.set('isEditing', false);

            if (Ember.isEmpty(this.get('model.title'))) {
                this.send('removeUser');
            } else {
                this.get('model').save();
            }
        },
        removeUser: function () {
            var self = this;
            var user = this.get('model');

            //pull the user model out of the collection
            self.get('parentController').popObject(user);

            //delete it from coalesce
            self.session.deleteModel(user);

            self.session.flush().then(function() {
                Coalesce.EmberSession.saveToStorage(self.session);
            }, function(error) {
                console.error(error);
                Coalesce.EmberSession.saveToStorage(self.session);                
            });

        }
    }
});