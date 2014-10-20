import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
        return this.session.query('user').then(function(value){
            return value;
        },function(error){
            console.error(error);
            return [];
        });
    },

    actions: {
        addUser: function() {
            var self = this;
            var properties = this.get("controller").getProperties("name");
            var user = this.session.create('user', properties);

            self.get("controller.model").pushObject(user);

            self.session.flush().then(function(models) {
                self.session.saveToStorage();
                self.get("controller").set("name", "");
            }, function(error) {
                self.session.saveToStorage();
                
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
            this.session.flush().then(function(models){
                alert('session flushed');
            },function(error){
                console.error(error);
                alert('backend down');
            });
        },

    }
});
