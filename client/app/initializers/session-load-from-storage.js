export default {
  name: 'session-load-from-storage',
  initialize: function(container, app) {
    var session = container.lookup('session:main');
    
    app.deferReadiness();
    session.loadFromStorage().then(function(){
        var _s = session;
        debugger
        app.advanceReadiness();
    });
  }
};
