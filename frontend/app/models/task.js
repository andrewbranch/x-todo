import DS from 'ember-data';

export default DS.Model.extend({

  title: DS.attr('string'),
  dueDate: DS.attr('date'),
  category: DS.belongsTo('category')

});
