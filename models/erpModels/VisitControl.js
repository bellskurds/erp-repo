const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const visitControlSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  comments: {
    type: String,
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true,
    autopopulate: true,
  },
  visit_date: {
    type: Date,
    default: Date.now,
  },
  visit_value: {
    type: Number,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

visitControlSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('VisitControl', visitControlSchema);
