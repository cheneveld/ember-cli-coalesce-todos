export default Coalesce.Model.extend({
	typeKey: 'todo',
	title: Coalesce.attr('string'),
	description: Coalesce.attr('string'),
	user: Coalesce.belongsTo('user', {embedded: true})
});
