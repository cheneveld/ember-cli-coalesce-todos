import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
        return this.session.query('user');
    },

    actions: {
        addUser: function() {
            var self = this;
            var user = this.session.create('user', this.get("controller").getProperties("name"));

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
