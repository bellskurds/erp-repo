/**
 *  Retrieves a single document by id.
 *  @param {string} req.params.id
 *  @returns {Document} Single Document
 */

const moment = require('moment');
const { default: mongoose } = require('mongoose');
exports.read = async (Model, req, res) => {
  try {
    // Find document by id
    const result = await Model.findOne({ _id: req.params.id, removed: false });
    // If no results found, return document not found
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    } else {
      // Return success resposne
      return res.status(200).json({
        success: true,
        result,
        message: 'we found this document by this id: ' + req.params.id,
      });
    }
  } catch (err) {
    // Server Error
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
      error: err,
    });
  }
};

/**
 *  Creates a Single document by giving all necessary req.body fields
 *  @param {object} req.body
 *  @returns {string} Message
 */

exports.create = async (Model, req, res) => {
  try {
    if (req.url.includes('company')) {
      const { email, db_name, name } = req.body;
      const Admin = mongoose.model(`${db_name}_Admin`, mongoose.model('Admin').schema);
      const admin = new Admin();
      const passwordHash = admin.generateHash('123');
      new Admin({
        email: email,
        password: passwordHash,
        surname: name,
        name: name,
        role: 0
      }).save()
    }

    // Creating a new document in the collection
    if (req.body.length) {
      const _Model = new Model();
      const date = new Date();
      date.setMonth(date.getMonth() + 1);

      const filter = { recurrent_id: req.body[0].recurrent_id, start_date: { $gte: date } };

      const collections = await Model.find({ recurrent_id: req.body[0].recurrent_id });

      const results = req.body.filter(item => {
        const month = parseInt(item.start_date.split("/")[0], 10);
        return month > date.getMonth();
      });
      await Model.deleteMany(filter)
      const result = await Model.insertMany(collections.length ? results : req.body);

      return res.status(200).json({
        success: true,
        result,
        message: 'Successfully Created the document in Model ',
      });
    } else {

      const result = await new Model(req.body).save();
      return res.status(200).json({
        success: true,
        result,
        message: 'Successfully Created the document in Model ',
      });
    }

    // Returning successfull response

  } catch (err) {
    console.log(err, '33333333')

    // If err is thrown by Mongoose due to required validations
    if (err.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
        error: err,
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Oops there is an Error',
        error: err,
      });
    }
  }
};
/**
 *  Updates a Single document
 *  @param {object, string} (req.body, req.params.id)
 *  @returns {Document} Returns updated document
 */

exports.update = async (Model, req, res) => {
  try {

    // Find document by id and updates with the required fields

    const param = req.body;
    if (param.primary) {
      await Model.updateMany({ removed: false }, { primary: false }, {
        new: true, // return the new result instead of the old one
        runValidators: true,
      }).exec();
    }
    const result = await Model.findOneAndUpdate({ _id: req.params.id, removed: false }, req.body, {
      new: true, // return the new result instead of the old one
      runValidators: true,
    }).exec();
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: 'we update this document by this id: ' + req.params.id,
      });
    }
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
        error: err,
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Oops there is an Error',
        error: err,
      });
    }
  }
};
exports.upload = async (Model, req, res) => {
  try {

    // Find document by id and updates with the required fields
    const updateData = {
      avatar: req.file.filename,
    }
    const id = req.body.id;
    const result = await Model.findOneAndUpdate({ _id: id, removed: false }, updateData, {
      new: true, // return the new result instead of the old one
      runValidators: true,
    }).exec();
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + id,
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: 'we update this document by this id: ' + id,
      });
    }
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
        error: err,
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Oops there is an Error',
        error: err,
      });
    }
  }
};


exports._upload = async (Model, req, res) => {
  try {
    // Creating a new document in the collection
    const updateData = {
      filename: req.file.filename,
      parent_id: req.body.parent_id,
      comments: req.body.comments,

    }
    const result = await new Model(updateData).save();
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully Created the document in Model ',
    });

    // Returning successfull response

  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == 'ValidationError') {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
        error: err,
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Oops there is an Error',
        error: err,
      });
    }
  }
};



/**
 *  Delete a Single document
 *  @param {string} req.params.id
 *  @returns {string} Message response
 */

exports.delete = async (Model, req, res) => {
  try {
    // Find the document by id and delete it
    let updates = {
      removed: true,
    };
    // Find the document by id and delete it
    const result = await Model.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { $set: updates },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();
    // If no results found, return document not found
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id: ' + req.params.id,
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: 'Successfully Deleted the document by id: ' + req.params.id,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
      error: err,
    });
  }
};

/**
 *  Get all documents of a Model
 *  @param {Object} req.params
 *  @returns {Object} Results with pagination
 */

exports.list = async (Model, req, res, modelName) => {


  // if (req.url.includes('employee')) {
  //   Model = employeeConnection.model('Employee', employeeSchema);

  // }

  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;
  try {
    //  Query the database for a list of all results
    const resultsPromise = Model.find({ removed: false })
      .skip(skip)
      // .limit(limit)
      .sort({ created: 'desc' })
      .populate();

    // Counting the total documents
    const countPromise = Model.count({ removed: false });
    // Resolving both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);
    // Calculating total pages
    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };
    if (count > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(203).json({
        success: false,
        result: [],
        pagination,
        message: 'Collection is Empty',
      });
    }
  } catch (err) {
    console.log(err, '3errrr')
    return res.status(500).json({
      success: false,
      result: [],
      message: 'Oops there is an Error',
      error: err,
    });
  }
};
/**
 *  Get all documents by field value of a Model
 *  @param {Object} req.params
 *  @returns {Object} Results with pagination
 */

exports.getByParentId = async (Model, req, res) => {
  const queryObj = req.body;

  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;
  try {
    //  Query the database for a list of all results
    const resultsPromise = Model.find({ ...queryObj, removed: false })
      .skip(skip)
      // .limit(limit)
      .sort({ created: 'desc' })
      .populate();
    // Counting the total documents
    const countPromise = Model.count({ ...queryObj, removed: false });
    // Resolving both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);
    // Calculating total pages
    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };
    if (count > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(203).json({
        success: false,
        result: [],
        pagination,
        message: 'Collection is Empty',
      });
    }
  } catch (err) {
    console.log(err, '333')

    return res.status(500).json({
      success: false,
      result: [],
      message: 'Oops there is an Error',
      error: err,
    });
  }
};

/**
 *  Searching documents with specific properties
 *  @param {Object} req.query
 *  @returns {Array} List of Documents
 */

exports.search = async (Model, req, res) => {
  // console.log(req.query.fields)
  // const limit = parseInt(req.query.items) || 10;

  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;
  if (req.query.q === undefined || req.query.q.trim() === '') {
    return res
      .status(202)
      .json({
        success: false,
        result: [],
        message: 'No document found by this request',
      })
      .end();
  }
  const fieldsArray = req.query.fields
    ? req.query.fields.split(',')
    : ['name', 'surname', 'birthday'];

  const fields = { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }
  // console.log(fields)
  try {
    let results = await Model.find(fields).where('removed', false)
      // .skip(skip)
      // .limit(limit)
      .sort({ created: 'desc' })
      .populate();
    // Resolving both promises

    const page = req.query.page || 1;
    const count = results.length;

    // Calculating total pages
    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const paginations = { page, pages, count };
    if (results.length >= 1) {
      return res.status(200).json({
        success: true,
        result: results,
        paginations,
        message: 'Successfully found all documents',
      });
    } else {
      return res
        .status(202)
        .json({
          success: false,
          result: [],
          paginations,
          message: 'No document found by this request',
        })
        .end();
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
      error: err,
    });
  }
};

/**
 *  Getting documents with filters
 *  @param {Object} req.query
 *  @returns {Array} List of Documents
 */

exports.filter = async (Model, req, res) => {
  try {
    if (req.query.filter === undefined || req.query.equal === undefined) {
      return res.status(403).json({
        success: false,
        result: null,
        message: 'filter not provided correctly',
      });
    }
    const result = await Model.find({ removed: false })
      .where(req.query.filter)
      .equals(req.query.equal);
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents where equal to : ' + req.params.equal,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
      error: err,
    });
  }
};
exports.status = async (Model, req, res) => {
  try {
    if (req.query.enabled == 'true' || req.query.enabled == 'false') {
      let updates = {
        enabled: req.query.enabled,
      };
      // Find the document by id and delete it
      const result = await Model.findOneAndUpdate(
        { _id: req.params.id, removed: false },
        { $set: updates },
        {
          new: true, // return the new result instead of the old one
        }
      ).exec();
      // If no results found, return document not found
      if (!result) {
        return res.status(404).json({
          success: false,
          result: null,
          message: 'No document found by this id: ' + req.params.id,
        });
      } else {
        return res.status(200).json({
          success: true,
          result,
          message: 'Successfully update status of this document by id: ' + req.params.id,
        });
      }
    } else {
      return res
        .status(202)
        .json({
          success: false,
          result: [],
          message: "couldn't change admin status by this request",
        })
        .end();
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
      error: err,
    });
  }
};
exports.getFilterbyDate = async (Model, req, res) => {
  try {
    const { filter, equal, date } = req.params;
    let day = null;
    if (date == 'today') {
      day = moment().format('DD/MM/YYYY');
    } else if (date == 'tomorrow') {
      day = moment().add(1, 'days').format('DD/MM/YYYY');
    } else {
      day = moment(date, 'DD-MM-YYYY').format('DD/MM/YYYY');
    }

    const result = await Model.find({ removed: false })
      .where(filter)
      .equals(equal)
      .where('date')
      .equals(day);

    if (result.length == 0) {
      return res.status(400).json({
        success: false,
        result: [],
        message: 'Date not found for this api',
      });
    }

    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents where equal to : ' + equal,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Oops there is an Error',
      error: err,
    });
  }
};
