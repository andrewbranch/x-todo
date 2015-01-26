/* global moment */
import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize: function (serialized) {
    if (serialized) {
      return moment.utc(serialized).local();
    }
    return null;
  },

  serialize: function (deserialized) {
    if (deserialized) {
      var serialized = deserialized.utc().format();
      deserialized.local();
      return serialized;
    }
    return null;
  }
});
