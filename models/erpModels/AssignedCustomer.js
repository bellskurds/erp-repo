const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const AssignedCustomerSchema = new mongoose.Schema({
  employee:
    { type: mongoose.Schema.ObjectId, ref: 'Employee', autopopulate: true },
  contract:
    { type: mongoose.Schema.ObjectId, ref: 'WorkContract', autopopulate: true },
  store:
    { type: mongoose.Schema.ObjectId, ref: 'CustomerStores', autopopulate: true },
  monday: {
    type: Object,
  },
  tuesday: {
    type: Object,
  },
  wednesday: {
    type: Object,
  },
  thursday: {
    type: Object,
  },
  friday: {
    type: Object,
  },
  saturday: {
    type: Object,
  },
  sunday: {
    type: Object,
  },
  sal_hr: {
    type: Number,
  },
  hr_week: {
    type: Number,
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
AssignedCustomerSchema.plugin(require('mongoose-autopopulate'));
// AssignedEmployeeSchema.index({
//   name: 'text',
//   surname: 'text',
//   birthday: 'text',
//   status: 'text',

// });
console.log(mongoose.Schema, 'mongoose.connection.modelsmongoose.connection.models')


module.exports = mongoose.model('AssignedCustomer', AssignedCustomerSchema);
