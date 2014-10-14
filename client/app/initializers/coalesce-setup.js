import User from 'todos/models/user';
import Todo from 'todos/models/todo';

User.reopenClass({
  typeKey:  'user'
});

Todo.reopenClass({
  typeKey:  'todo'
});

var decamelize = Ember.String.decamelize,
    underscore = Ember.String.underscore,
    pluralize = Ember.String.pluralize;

var Serializer = Coalesce.ActiveModelSerializer.extend({
  keyForType: function(name, type, opts) {
    var key = this._super(name, type);
    if(!opts || !opts.embedded) {
      if(type === 'belongs-to') {
        return key;
      } else if(type === 'has-many') {
        return Ember.String.singularize(key);
      }
    }
    return key;
  }
});

var TodoSerializer = Serializer.extend({
  properties: {
    user: { embedded: true }
  }
});

var UserSerializer = Serializer.extend({
  properties: {
    todos: { embedded: true }
  }
});

var Adapter = Coalesce.ActiveModelAdapter.extend({
	host: 'http://localhost:3000',
    defaultSerializer: 'payload',
});

export default {
  name: 'coalesce-setup',
  before: 'coalesce.container',
  initialize: function(container) {
    container.register('adapter:application', Adapter);
  }
};

