export default Coalesce.Model.extend({
	typeKey: 'user',
	name: Coalesce.attr('string'),
	todos: Coalesce.hasMany('todo')
});
