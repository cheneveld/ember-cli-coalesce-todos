import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
        var self = this;
        return this.session.query('user').then(function(users){
            var session = self.session;
            Coalesce.EmberSession.saveToStorage(session);
            // debugger
            return users;
        });
    },

    actions: {
        addUser: function() {
            var self = this;
            var properties = this.get("controller").getProperties("name");
            var user = this.session.create('user', properties);

            // debugger;
            var model = this.get("controller.model");

            model.pushObject(user);

            self.session.flush().then(function() {
                Coalesce.EmberSession.saveToStorage(this.session);
                self.get("controller").set("name", "");
            }, function(error) {
                console.error(error);
                Coalesce.EmberSession.saveToStorage(this.session);
                
            });
        },
        saveToStorage: function() {
            Coalesce.EmberSession.saveToStorage(this.session).then(function() {
                alert('saved!');
            }, function() {
                alert('error!');
            });
        },
        loadFromStorage: function() {
            Coalesce.EmberSession.loadFromStorage(this.session).then(function() {
                alert('loaded!');
            }, function() {
                alert('error!');
            });
        },
        flushSession: function(){
            this.session.flush().then(function(){
                alert('session flushed');
            },function(error){
                console.error(error);
                alert('backend down');
            });
        },

    }
});
