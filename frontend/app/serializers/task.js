import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({

  normalizePayload: function (payload) {
    return { task: payload };
  }

});
