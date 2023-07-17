const employeeSchema = require('@/models/erpModels/Employee');
const apiRest = require('./apiRest');
const mongoose = require('mongoose');


exports.createCRUDController = (modelName, filter = []) => {

  const Model = mongoose.model(modelName);
  let crudMethods = {};

  if (!filter.includes('create')) {
    crudMethods.create = async (req, res) => {
      apiRest.create(Model, req, res);
    };
  }
  if (!filter.includes('read')) {
    crudMethods.read = async (req, res) => {
      apiRest.read(Model, req, res);
    };
  }
  if (!filter.includes('update')) {
    crudMethods.update = async (req, res) => {
      apiRest.update(Model, req, res);
    };
  }
  if (!filter.includes('delete')) {
    crudMethods.delete = async (req, res) => {
      apiRest.delete(Model, req, res);
    };
  }
  if (!filter.includes('list')) {
    crudMethods.list = async (req, res) => {
      apiRest.list(Model, req, res);
    };
  }
  if (!filter.includes('search')) {
    crudMethods.search = async (req, res) => {
      apiRest.search(Model, req, res);
    };
  }
  if (!filter.includes('filter')) {
    crudMethods.filter = async (req, res) => {
      apiRest.filter(Model, req, res);
    };
  }
  if (!filter.includes('status')) {
    crudMethods.status = async (req, res) => {
      apiRest.status(Model, req, res);
    };
  }
  if (!filter.includes('getFilterbyDate')) {
    crudMethods.getFilterbyDate = async (req, res) => {
      apiRest.getFilterbyDate(Model, req, res);
    };
  }
  if (!filter.includes('byParentId')) {
    crudMethods.getByParentId = async (req, res) => {
      apiRest.getByParentId(Model, req, res);
    };
  }
  if (!filter.includes('upload')) {
    crudMethods.upload = async (req, res) => {
      apiRest.upload(Model, req, res);
    };
  }
  if (!filter.includes('_upload')) {
    crudMethods._upload = async (req, res) => {
      apiRest._upload(Model, req, res);
    };
  }
  return crudMethods;
};
