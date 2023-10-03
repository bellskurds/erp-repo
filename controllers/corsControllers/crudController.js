const apiRest = require('./apiRest');
const mongoose = require('mongoose');
exports.createCRUDController = (modelName, filter = []) => {
  var Model = mongoose.model(modelName);
  let crudMethods = {};

  if (!filter.includes('create')) {
    crudMethods.create = async (req, res) => {
      const modelSchema = Model.schema;
      const { db_name } = req.session;
      if (db_name) {
        Model = mongoose.model(`${db_name}_${modelName}`, modelSchema);
      } else {
        Model = mongoose.model(modelName, modelSchema);
      }

      apiRest.create(Model, req, res);
    };
  }
  if (!filter.includes('read')) {
    crudMethods.read = async (req, res) => {
      const modelSchema = Model.schema;
      const { db_name } = req.session;
      if (db_name) {
        Model = mongoose.model(`${db_name}_${modelName}`, modelSchema);
      } else {
        Model = mongoose.model(modelName, modelSchema);
      }
      apiRest.read(Model, req, res);
    };
  }
  if (!filter.includes('update')) {
    crudMethods.update = async (req, res) => {
      const modelSchema = Model.schema;
      const { db_name } = req.session;
      if (db_name) {
        Model = mongoose.model(`${db_name}_${modelName}`, modelSchema);
      } else {
        Model = mongoose.model(modelName, modelSchema);
      }
      apiRest.update(Model, req, res);
    };
  }
  if (!filter.includes('delete')) {
    crudMethods.delete = async (req, res) => {
      const modelSchema = Model.schema;
      const { db_name } = req.session;
      if (db_name) {
        Model = mongoose.model(`${db_name}_${modelName}`, modelSchema);
      } else {
        Model = mongoose.model(modelName, modelSchema);
      }
      apiRest.delete(Model, req, res);
    };
  }
  if (!filter.includes('list')) {

    crudMethods.list = async (req, res) => {


      const modelSchema = Model.schema;
      const { db_name } = req.session;
      if (!req.url.includes('company') && db_name) {
        Model = mongoose.model(`${db_name}_${modelName}`, modelSchema);
      } else {
        Model = mongoose.model(modelName, modelSchema);
      }
      apiRest.list(Model, req, res, modelName);
    };
  }
  if (!filter.includes('search')) {
    crudMethods.search = async (req, res) => {
      const modelSchema = Model.schema;
      const { db_name } = req.session;
      if (db_name) {
        Model = mongoose.model(`${db_name}_${modelName}`, modelSchema);
      } else {
        Model = mongoose.model(modelName, modelSchema);
      }
      apiRest.search(Model, req, res);
    };
  }
  if (!filter.includes('filter')) {
    crudMethods.filter = async (req, res) => {
      const modelSchema = Model.schema;
      const { db_name } = req.session;
      if (db_name) {
        Model = mongoose.model(`${db_name}_${modelName}`, modelSchema);
      } else {
        Model = mongoose.model(modelName, modelSchema);
      }
      apiRest.filter(Model, req, res);
    };
  }
  if (!filter.includes('status')) {
    crudMethods.status = async (req, res) => {
      const modelSchema = Model.schema;
      const { db_name } = req.session;
      if (db_name) {
        Model = mongoose.model(`${db_name}_${modelName}`, modelSchema);
      } else {
        Model = mongoose.model(modelName, modelSchema);
      }
      apiRest.status(Model, req, res);
    };
  }
  if (!filter.includes('getFilterbyDate')) {
    crudMethods.getFilterbyDate = async (req, res) => {
      const modelSchema = Model.schema;
      const { db_name } = req.session;
      if (db_name) {
        Model = mongoose.model(`${db_name}_${modelName}`, modelSchema);
      } else {
        Model = mongoose.model(modelName, modelSchema);
      }
      apiRest.getFilterbyDate(Model, req, res);
    };
  }
  if (!filter.includes('byParentId')) {
    crudMethods.getByParentId = async (req, res) => {
      const modelSchema = Model.schema;
      const { db_name } = req.session;
      console.log(db_name, modelName, '343434334')
      if (db_name) {
        Model = mongoose.model(`${db_name}_${modelName}`, modelSchema);
      } else {
        Model = mongoose.model(modelName, modelSchema);
      }
      apiRest.getByParentId(Model, req, res);
    };
  }
  if (!filter.includes('upload')) {
    crudMethods.upload = async (req, res) => {
      const modelSchema = Model.schema;
      const { db_name } = req.session;
      if (db_name) {
        Model = mongoose.model(`${db_name}_${modelName}`, modelSchema);
      } else {
        Model = mongoose.model(modelName, modelSchema);
      }
      apiRest.upload(Model, req, res);
    };
  }
  if (!filter.includes('_upload')) {
    crudMethods._upload = async (req, res) => {
      const modelSchema = Model.schema;
      const { db_name } = req.session;
      if (db_name) {
        Model = mongoose.model(`${db_name}_${modelName}`, modelSchema);
      } else {
        Model = mongoose.model(modelName, modelSchema);
      }
      apiRest._upload(Model, req, res);
    };
  }
  return crudMethods;
};
