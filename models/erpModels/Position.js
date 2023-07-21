const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const PositionSchema = new mongoose.Schema({
  position: {
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
PositionSchema.plugin(require('mongoose-autopopulate'));
// AssignedEmployeeSchema.index({
//   name: 'text',
//   surname: 'text',
//   birthday: 'text',
//   status: 'text',

// });


module.exports = mongoose.model('Position', PositionSchema);
