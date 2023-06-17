const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const BankAccountSchema = new mongoose.Schema({
  bank: {
    type: String,
  },
  account_type: {
    type: String,
  },
  name: {
    type: String,
  },
  account_no: {
    type: String,
  },
  account_no: {
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
// BankAccountSchema.plugin(require('mongoose-autopopulate'));
// BankAccountSchema.index({
//   name: 'text',
//   surname: 'text',
//   birthday: 'text',
//   status: 'text',
// });

module.exports = mongoose.model('BankAccount', BankAccountSchema);
