const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const EmergencyContactSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  lastname: {
    type: String,
  },
  phone: {
    type: String,
  },
  parent_id: {
    type: String,
  },
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
// EmergencyContactSchema.plugin(require('mongoose-autopopulate'));
// EmergencyContactSchema.index({
//   name: 'text',
//   surname: 'text',
//   birthday: 'text',
//   status: 'text',
// });

module.exports = mongoose.model('EmergencyContact', EmergencyContactSchema);
