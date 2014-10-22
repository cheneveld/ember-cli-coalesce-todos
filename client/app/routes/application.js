import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
        var self = this;
        return this.session.query('user').then(function(users){
            Coalesce.EmberSession.saveToStorage(self.session);
            return users;
        }, function(error){
          return self.session.fetchQuery('user');
        });
    },

    actions: {
        flush: function() {
            var self = this;
            console.log("Application::flush: starting flush");
            self.session.flush().then(function() {
                Coalesce.EmberSession.saveToStorage(self.session);
                console.log("Application::flush: done");
            }, function(error) {
                console.error(error);
                Coalesce.EmberSession.saveToStorage(self.session);                
                console.log("Application::flush: error", error);
            });
        },
        addUser: function() {
            var self = this;
            var properties = this.get("controller").getProperties("name");
            var user = this.session.create('user', properties);

            var model = this.get("controller.model");

            model.pushObject(user);

            self.get("controller").set("name", "");

            self.session.flush().then(function() {
                Coalesce.EmberSession.saveToStorage(self.session);
            }, function(error) {
                console.error(error);
                Coalesce.EmberSession.saveToStorage(self.session);                
            });
        }
    }
});
