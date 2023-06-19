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
  products: {
    type: String
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
// CustomerStoresSchema.plugin(require('mongoose-autopopulate'));
// CustomerStoresSchema.index({
//   name: 'text',
//   surname: 'text',
//   birthday: 'text',
//   status: 'text',
// });

module.exports = mongoose.model('CustomerStores', CustomerStoresSchema);
