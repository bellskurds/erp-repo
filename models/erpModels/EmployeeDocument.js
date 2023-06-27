const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const EmployeeDocumentSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  filename: {
    type: String,
    trim: true,
    // required: true,
  },
  parent_id: {
    type: mongoose.Schema.ObjectId, ref: 'Employee', autopopulate: true
  },
  comments: {
    type: String,
    trim: true,
    // required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

EmployeeDocumentSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('EmployeeDocument', EmployeeDocumentSchema);
