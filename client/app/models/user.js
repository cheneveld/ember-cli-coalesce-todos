export default Coalesce.Model.extend({
	name: Coalesce.attr('string'),
	todos: Coalesce.hasMany('todo')
});
