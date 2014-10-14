// import Ep from "../../bower_components/coalesce-ember/coalesce-ember.amd";

export default Ep.Model.extend({
	typeKey: 'todo',
	title: Ep.attr('string'),
	description: Ep.attr('string'),
	user: Ep.belongsTo('user', {embedded: true})
});
