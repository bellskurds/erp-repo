const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const AssignedEmployeeSchema = new mongoose.Schema({
  employee: {
    type: String,
  },
  contract: {
    type: String,
  },
  store: {
    type: String,
  },
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
// AssignedEmployeeSchema.plugin(require('mongoose-autopopulate'));
// AssignedEmployeeSchema.index({
//   name: 'text',
//   surname: 'text',
//   birthday: 'text',
//   status: 'text',
// });

module.exports = mongoose.model('AssignedEmployee', AssignedEmployeeSchema);
