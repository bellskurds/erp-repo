const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const CustomerStoresSchema = new mongoose.Schema({
  store: {
    type: String,
  },
  hours: {
    type: String,
  },
  hr_week: {
    type: String,
  },
  location: {
    type: String,
  },
  billing: {
    type: Number,
  },
  status: {
    type: Number,
  },
  rest_hr: {
    type: Number,
  },
  hr_day: {
    type: Number,
  },
  days_week: {
    type: Number,
  },
  days_week: {
    type: Number,
  },
  products: {
    type: String
  },
  monday: {
    type: Object
  },
  tuesday: {
    type: Object
  },
  wednesday: {
    type: Object
  },
  thursday: {
    type: Object
  },
  friday: {
    type: Object
  },
  saturday: {
    type: Object
  },
  sunday: {
    type: Object
  },

  parent_id: {

    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    autopopulate: true

  },
  insumos: {
    type: Boolean,
  },
  visit_value: {
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
CustomerStoresSchema.plugin(require('mongoose-autopopulate'));
// CustomerStoresSchema.index({
//   name: 'text',
//   surname: 'text',
//   birthday: 'text',
//   status: 'text',
// });

module.exports = mongoose.model('CustomerStores', CustomerStoresSchema);
