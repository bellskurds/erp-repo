const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const MedicalDetailSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  description: {
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
// MedicalDetailSchema.plugin(require('mongoose-autopopulate'));
// MedicalDetailSchema.index({
//   name: 'text',
//   surname: 'text',
//   birthday: 'text',
//   status: 'text',
// });

module.exports = mongoose.model('MedicalDetail', MedicalDetailSchema);
