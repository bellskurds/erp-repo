const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const RecurrentInvoiceSchema = new mongoose.Schema({
  store:
    { type: mongoose.Schema.ObjectId, ref: 'CustomerStores', autopopulate: true },

  description: {
    type: String,
  },
  amount: {
    type: Number,
  },
  taxes: {
    type: Number,
  },
  frequency: {
    type: Number,
  },
  start_date: {
    type: Object,
  },
  end_date: {
    type: Object,
  },
  unlimited: {
    type: Boolean,
  },
  taxes_flag: {
    type: Boolean,
  },
  parent_id: {
    type: mongoose.Schema.ObjectId, ref: 'Client', autopopulate: true
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
RecurrentInvoiceSchema.plugin(require('mongoose-autopopulate'));
// AssignedEmployeeSchema.index({
//   name: 'text',
//   surname: 'text',
//   birthday: 'text',
//   status: 'text',

// });


module.exports = mongoose.model('RecurrentInvoice', RecurrentInvoiceSchema);
