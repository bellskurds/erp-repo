const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const CustomerContactsSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  position: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  primary: {
    type: Boolean,
    default: false
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
// CustomerContactsSchema.plugin(require('mongoose-autopopulate'));
// CustomerContactsSchema.index({
//   name: 'text',
//   surname: 'text',
//   birthday: 'text',
//   status: 'text',
// });

module.exports = mongoose.model('CustomerContacts', CustomerContactsSchema);
