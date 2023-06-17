const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const RelatedPeopleSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  lastname: {
    type: String,
  },
  relation: {
    type: String,
  },
  contact: {
    type: String,
  },
  address: {
    type: String,
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
// RelatedPeopleSchema.plugin(require('mongoose-autopopulate'));
// RelatedPeopleSchema.index({
//   name: 'text',
//   surname: 'text',
//   birthday: 'text',
//   status: 'text',
// });

module.exports = mongoose.model('RelatedPeople', RelatedPeopleSchema);
