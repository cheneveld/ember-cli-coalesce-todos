export default Cs.Model.extend({
	typeKey: 'user',
	name: Ep.attr('string'),
	todos: Ep.hasMany('todo')
});
