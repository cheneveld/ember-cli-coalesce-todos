import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
        var self = this;
        return this.session.query('user').then(function(users){
            return users;
        }, function(error){
          console.error("Application::query('user') failed, now calling fetchQuery");
          return self.session.fetchQuery('user');
        });
    },

    actions: {
        flush: function() {
            console.log("Application::flush: starting flush");
            this.session.flush().then(function() {
                console.log("Application::flush: done");
            }, function(error) {
                console.error("Application::flush: error", error);
            });
        },
        saveToStorage: function(){
          var session = this.session;

          console.log('session newModels length =', session.newModels.size);

          Coalesce.EmberSession.saveToStorage(session).then(function(){
            console.log('session newModels length =', session.newModels.size);
            console.log("Application::saveToStorage: done");
          }, function(error){
            console.error("Application::saveToStorage: error", error);
          });
        },
        addUser: function() {
            var session = this.session; 
            var properties = this.get("controller").getProperties("name");
            var user = this.session.create('user', properties);

            var model = this.get("controller.model");

            model.pushObject(user);

            this.get("controller").set("name", "");

            console.log('session newModels length =', session.newModels.size);

            session.flush().then(function() {
                console.log("Application::addUser: flush done");
            }, function(error) {
                console.error("Application::addUser: flush error", error);
                           
            });
        },
        logCollectionCounts: function(){
          var session = this.session;

          console.log('session newModels length =', session.newModels.size);
          console.log('session models length =', session.models.size);
          console.log('session shadows length =', session.shadows.size);
        },
    }
});
