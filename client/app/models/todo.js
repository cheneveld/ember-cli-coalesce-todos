export default Coalesce.Model.extend({
	title: Coalesce.attr('string'),
	description: Coalesce.attr('string'),
	user: Coalesce.belongsTo('user', {embedded: true}),

    serializedString: function(){
        return this.toString();

    }.property()
});