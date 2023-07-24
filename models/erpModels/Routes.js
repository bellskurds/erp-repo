const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const ReferenceSchema = new mongoose.Schema({
  routes: {
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
ReferenceSchema.plugin(require('mongoose-autopopulate'));
// AssignedEmployeeSchema.index({
//   name: 'text',
//   surname: 'text',
//   birthday: 'text',
//   status: 'text',

// });


module.exports = mongoose.model('Routes', ReferenceSchema);
