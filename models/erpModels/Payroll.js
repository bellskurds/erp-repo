const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const PayrollSchema = new mongoose.Schema({
  comment: {
    type: String,
  },
  date: {
    type: String,
  },
  hour: {
    type: Number,
  },
  contract: {
    type: String,
  },
  by: {
    type: String,
  },
  customer: {
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
PayrollSchema.plugin(require('mongoose-autopopulate'));
// AssignedEmployeeSchema.index({
//   name: 'text',
//   surname: 'text',
//   birthday: 'text',
//   status: 'text',

// });


module.exports = mongoose.model('Payroll', PayrollSchema);
