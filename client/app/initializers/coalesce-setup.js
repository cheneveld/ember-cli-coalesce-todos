import User from 'todos/models/user';
import Todo from 'todos/models/todo';

User.reopenClass({
  typeKey:  'user'
});

Todo.reopenClass({
  typeKey:  'todo'
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

