const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const VacHistorySchema = new mongoose.Schema({
  date: {
    type: String,
  },
  comment: {
    type: String,
  },
  name: {
    type: String,
  },
  by: {
    type: String,
  },
  paidPeriods: {
    type: String,
  },
  contract_id: {
    type: String,
  },
  employee: {
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
// VacHistorya.plugin(require('mongoose-autopopulate'));
// VacHistoryma.index({
//   name: 'text',
//   surname: 'text',
//   birthday: 'text',
//   status: 'text',
// });

module.exports = mongoose.model('VacHistory', VacHistorySchema);
