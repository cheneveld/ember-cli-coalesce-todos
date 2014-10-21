export default {
  name: 'session-load-from-storage',
  initialize: function(container) {
    var session = container.lookup('session:main');
    session.loadFromStorage();
  }
};
