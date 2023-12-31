const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const AssignedEmployeeSchema = new mongoose.Schema({
  employee:
    { type: mongoose.Schema.ObjectId, ref: 'Employee', autopopulate: true },
  contract:
    { type: mongoose.Schema.ObjectId, ref: 'WorkContract', autopopulate: true },
  viaticum:
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
  position: {
    type: String,
  },
  gross_salary: {
    type: Number,
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
  start_date: {
    type: Date,
  },
  viaticum_start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  viaticum_end_date: {
    type: Date,
  },
  unassigned: {
    type: Boolean,
  },
  every_hours: {
    type: Object
  },
  is_custom_monday: {
    type: Boolean
  },
  is_custom_tuesday: {
    type: Boolean
  }
  ,
  is_custom_wednesday: {
    type: Boolean
  }
  ,
  is_custom_thursday: {
    type: Boolean
  }
  ,
  is_custom_friday: {
    type: Boolean
  }
  ,
  is_custom_saturday: {
    type: Boolean
  }
  ,
  is_custom_sunday: {
    type: Boolean
  }
});
AssignedEmployeeSchema.plugin(require('mongoose-autopopulate'));
// AssignedEmployeeSchema.index({
//   name: 'text',
//   surname: 'text',
//   birthday: 'text',
//   status: 'text',
// });

module.exports = mongoose.model('AssignedEmployee', AssignedEmployeeSchema);

