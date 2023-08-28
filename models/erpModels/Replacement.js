const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const ReplacementSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  contract_type: {
    type: Number,
  },
  employee: {
    type: mongoose.Schema.ObjectId, ref: 'Employee', autopopulate: true
  },
  store: {
    type: mongoose.Schema.ObjectId, ref: 'CustomerStores', autopopulate: true
  },
  sal_hr: {
    type: Number,
  },
  replacement: {
    type: mongoose.Schema.ObjectId, ref: 'Employee', autopopulate: true
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  hours: {
    type: Object
  },
  payroll_id: {
    type: String
  }
});
ReplacementSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Replacement', ReplacementSchema);
