export default Ep.Model.extend({
	typeKey: 'user',
	name: Ep.attr('string'),
	todos: Ep.hasMany('todo')
});
