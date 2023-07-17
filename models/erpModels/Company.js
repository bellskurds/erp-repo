const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const companySchema = new mongoose.Schema({

  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
  },
  company_name: {
    type: String,
  },
  email: {
    type: String,
  },
  users: {
    type: Number
  },
  periods: {
    type: Object,
  },
  status: {
    type: Number,
  },
  db_name: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
companySchema.plugin(require('mongoose-autopopulate'));



module.exports = mongoose.model('Company', companySchema);
