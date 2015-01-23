import DS from 'ember-data';

export default DS.RESTSerializer.extend({

  serializeIntoHash: function (hash, type, record, options) {
    if (record.id) {
      Ember.merge(hash, { id: record.id });
    }
    return Ember.merge(hash, this.serialize(record, options));
  },

  keyForRelationship: function (key, relationship) {
    return key + 'Id';
  }
});
