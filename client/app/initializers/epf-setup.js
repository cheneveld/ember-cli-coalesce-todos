import User from 'todos/models/user';
import Todo from 'todos/models/todo';

var decamelize = Ember.String.decamelize,
    underscore = Ember.String.underscore,
    pluralize = Ember.String.pluralize;

var Serializer = Cs.ModelSerializer.extend({
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

var Adapter = Cs.ActiveModelAdapter.extend({
	host: 'http://localhost:3000',
  defaultSerializer: 'payload',

  setupContainer: function(parent) {
    var container = this._super(parent);
    container.register('serializer:model', Serializer);
    container.register('serializer:todo', TodoSerializer);
    container.register('serializer:user', UserSerializer);
    return container;
  }
});

export default {
  name: 'epf-setup',
  before: 'epf.container',
  initialize: function(container) {
    container.register('adapter:application', Adapter);
  }
};

