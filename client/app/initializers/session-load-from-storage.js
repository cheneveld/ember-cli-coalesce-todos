export default {
  name: 'session-load-from-storage',
  initialize: function(container, app) {
    var session = container.lookup('session:main');
    session.loadFromStorage();
  }
};
