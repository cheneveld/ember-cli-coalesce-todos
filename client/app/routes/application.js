import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		return this.session.query('user');
	},

	actions: {
		addUser: function(){
			var self = this;
			var user = this.session.create('user', this.get("controller").getProperties("name"));

			self.session.flush().then(function(models){
                var savedUser = models[0];

                // response from server
                //{"user":{"id":5,"name":"johnny","todos":[]}}

                // shouldn't this user object contain an id?
                // ex: savedUser id null 
                console.log("savedUser id", savedUser.get('id'));

                self.get("controller.model").pushObject(savedUser);
                
            }, function(){
				self.get("controller.model").removeObject(user);				
			});
		}
	}
});