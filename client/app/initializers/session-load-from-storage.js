
export default {
  name: 'session-load-from-storage',
  initialize: function(container, app) {
    var session = container.lookup('session:main');
    
    app.deferReadiness();
    //debugger
    var promise = Coalesce.EmberSession.loadFromStorage(session);

    promise.then(function(){
        app.advanceReadiness();
    }, function(error){
      app.advanceReadiness();
    });
  }
};
