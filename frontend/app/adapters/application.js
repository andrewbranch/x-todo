import DS from 'ember-data';
var staticEnvironment = window.XTodo.environment === 'static';

export default staticEnvironment? DS.FixtureAdapter : DS.RESTAdapter.extend({

  namespace: 'api',
  host: 'http://localhost:50993'

});
