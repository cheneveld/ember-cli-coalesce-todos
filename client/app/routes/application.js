import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		return this.session.query('user');
	},

	actions: {
		addUser: function(){
			var self = this;
			var user = this.session.create('user', this.get("controller").getProperties("name"));

			self.get("controller.model").pushObject(user);

			self.session.flush().then(null, function(){
				self.get("controller.model").removeObject(user);				
			});
		}
	}
});