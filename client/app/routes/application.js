import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
        return this.session.query('user');
    },

    actions: {
        addUser: function() {
            var self = this;
            var user = this.session.create('user', this.get("controller").getProperties("name"));

            console.log('session about to be stored.');

            var modelsArray = self.session.models.toArray();

            console.log(modelsArray[0]);

           // var serializerFactory = new Coalesce.SerializerFactory(this.container);

            var serialized = [];

            serialized = modelsArray.map(function(model){
                var serializer =  self.container.lookup('serializer:model');

                return serializer.serialize(model);
            });

            localforage.setItem('session_models', serialized).then(function(value) {
                alert(value + ' was set!');
            }, function(error) {
                console.error(error);
            });

            self.session.flush().then(function(models) {
                var savedUser = models[0];
                self.get("controller.model").pushObject(savedUser);

                self.get("controller").set("name", "");
            }, function() {
                self.get("controller.model").removeObject(user);
            });
        }
    }
});
