import DS from 'ember-data';

export default DS.Model.extend({

  name: DS.attr('string'),
  color: DS.attr('string'),
  disclosed: DS.attr('boolean'),
  index: DS.attr('number'),
  tasks: DS.hasMany('task')

});
