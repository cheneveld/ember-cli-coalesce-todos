import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
        return this.session.query('user').then(function(users){
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
                // self.session.saveToStorage();
                self.get("controller").set("name", "");
            }, function(error) {
                console.error(error);
                // self.session.saveToStorage();
                
            });
        },
        saveToStorage: function() {
            this.session.saveToStorage().then(function() {
                alert('saved!');
            }, function() {
                alert('error!');
            });
        },
        loadFromStorage: function() {
            this.session.loadFromStorage().then(function() {
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
