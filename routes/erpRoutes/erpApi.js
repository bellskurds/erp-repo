const express = require('express');
const multer = require('multer');
const fs = require('fs');

const path = require('path');
const setFilePathToBody = require('@/middlewares/setFilePathToBody');
const { catchErrors, sendMail } = require('@/handlers/errorHandlers');

const router = express.Router();

const adminController = require('@/controllers/erpControllers/adminController');
const roleController = require('@/controllers/erpControllers/roleController');

const employeeController = require('@/controllers/erpControllers/employeeController');
const paymentModeController = require('@/controllers/erpControllers/paymentModeController');
const clientController = require('@/controllers/erpControllers/clientController');
const invoiceController = require('@/controllers/erpControllers/invoiceController');
const itemController = require('@/controllers/erpControllers/itemController');
const quoteController = require('@/controllers/erpControllers/quoteController');
const supplierController = require('@/controllers/erpControllers/supplierController');
const orderFormController = require('@/controllers/erpControllers/orderFormController');
const expenseController = require('@/controllers/erpControllers/expenseController');
const expenseCategoryController = require('@/controllers/erpControllers/expenseCategoryController');
const paymentInvoiceController = require('@/controllers/erpControllers/paymentInvoiceController');

const settingCommercialController = require('@/controllers/erpControllers/settingCommercialController');
const settingGlobalController = require('@/controllers/erpControllers/settingGlobalController');
const bankAccountController = require('@/controllers/erpControllers/bankAccountController');
const relatedPeopleController = require('@/controllers/erpControllers/relatedPeopleController');
const emergencyContactController = require('@/controllers/erpControllers/emergencyContactController');
const medicalDetailController = require('@/controllers/erpControllers/medicalDetailController');
const workContractController = require('@/controllers/erpControllers/workContractController');
const { upload } = require('@/controllers/erpControllers/uploadController');
const customerContactsController = require('@/controllers/erpControllers/customerContactsController');
const customerStoresController = require('@/controllers/erpControllers/customerStoresController');
const assignedEmployeeController = require('@/controllers/erpControllers/assignedEmployeeController');
const assignedCustomerController = require('@/controllers/erpControllers/assignedCustomerController');
const recurrentInvoiceController = require('@/controllers/erpControllers/recurrentInvoiceController');
const invoiceHistoryController = require('@/controllers/erpControllers/invoiceHistoryController');
const documentManageController = require('@/controllers/erpControllers/documentManageController');
const employeeDocumentController = require('@/controllers/erpControllers/employeeDocumentController');
const ProjectController = require('@/controllers/erpControllers/ProjectController');
const referenceController = require('@/controllers/erpControllers/referenceController');
const payrollController = require('@/controllers/erpControllers/payrollController');
const visitControlController = require('@/controllers/erpControllers/visitControlController');
const companyController = require('@/controllers/erpControllers/companyController');
const positionController = require('@/controllers/erpControllers/positionController');
const routesController = require('@/controllers/erpControllers/routesController');
const replacementController = require('@/controllers/erpControllers/replacementController');
const vacHistoryController = require('@/controllers/erpControllers/vacHistoryController');
const dtmHistoryController = require('@/controllers/erpControllers/dtmHistoryController');

const baseFilePath = 'public/uploads/admin/'
// //_______________________________ Admin management_______________________________

var adminPhotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/admin');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
var document = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/admin');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const documentUpload = multer({ storage: document });
const adminPhotoUpload = multer({ storage: adminPhotoStorage });
const _upload = multer({ dest: 'public/uploads/user/' });

router
  .route('/admin/create')
  .post([adminPhotoUpload.single('photo'), setFilePathToBody], catchErrors(adminController.create));
router.route('/admin/read/:id').get(catchErrors(adminController.read));
router.route("/admin/update/:id").patch(catchErrors(adminController.update));
router.route("/admin/delete/:id").delete(catchErrors(adminController.delete));
router.route('/admin/search').get(catchErrors(adminController.search));
router.route('/admin/list').get(catchErrors(adminController.list));
router.route('/admin/profile').get(catchErrors(adminController.profile));
router.route('/admin/status/:id').patch(catchErrors(adminController.status));
router
  .route("/admin/photo")
  .post(
    [adminPhotoUpload.single("photo"), setFilePathToBody],
    catchErrors(adminController.photo)
  );
router
  .route("/admin/password-update/:id")
  .patch(catchErrors(adminController.updatePassword));

// //____________________________ Role management_______________________________

router.route('/role/create').post(catchErrors(roleController.create));
router.route('/role/read/:id').get(catchErrors(roleController.read));
router.route('/role/update/:id').patch(catchErrors(roleController.update));
router.route('/role/delete/:id').delete(catchErrors(roleController.delete));
router.route('/role/search').get(catchErrors(roleController.search));
router.route('/role/list').get(catchErrors(roleController.list));
router.route('/role/filter').get(catchErrors(roleController.filter));

// //_________________________________ API for employees_____________________
router.route('/employee/create').post(catchErrors(employeeController.create));
router.route('/employee/read/:id').get(catchErrors(employeeController.read));
router.route('/employee/update/:id').patch(catchErrors(employeeController.update));
router.route('/employee/delete/:id').delete(catchErrors(employeeController.delete));
router.route('/employee/search').get(catchErrors(employeeController.search));
router.route('/employee/list').get(catchErrors(employeeController.list));
router.route('/employee/filter').get(catchErrors(employeeController.filter));
router.route('/employee/upload').post(adminPhotoUpload.single('avatar'), catchErrors(employeeController.upload))


// //_________________________________ API for employees_____________________
router.route('/project/create').post(catchErrors(ProjectController.create));
router.route('/project/read/:id').get(catchErrors(ProjectController.read));
router.route('/project/update/:id').patch(catchErrors(ProjectController.update));
router.route('/project/delete/:id').delete(catchErrors(ProjectController.delete));
router.route('/project/search').get(catchErrors(ProjectController.search));
router.route('/project/list').get(catchErrors(ProjectController.list));
router.route('/project/filter').get(catchErrors(ProjectController.filter));
router.route('/project/upload').post(adminPhotoUpload.single('avatar'), catchErrors(ProjectController.upload))
router.route('/project/byParentId').post(catchErrors(ProjectController.getByParentId));




// //_________________________________ API for documentManage
router.route('/documentManage/create').post(catchErrors(documentManageController.create));
router.route('/documentManage/read/:id').get(catchErrors(documentManageController.read));
router.route('/documentManage/update/:id').patch(catchErrors(documentManageController.update));
router.route('/documentManage/delete/:id').delete(catchErrors(documentManageController.delete));
router.route('/documentManage/search').get(catchErrors(documentManageController.search));
router.route('/documentManage/list').get(catchErrors(documentManageController.list));
router.route('/documentManage/filter').get(catchErrors(documentManageController.filter));
router.route('/documentManage/upload').post(documentUpload.single('file'), catchErrors(documentManageController._upload))
router.route('/documentManage/byParentId').post(catchErrors(documentManageController.getByParentId));




// //_________________________________ API for documentManage of Employeee
router.route('/employeeDocument/create').post(catchErrors(employeeDocumentController.create));
router.route('/employeeDocument/read/:id').get(catchErrors(employeeDocumentController.read));
router.route('/employeeDocument/update/:id').patch((req, res, next) => {

  try {

    const oldPath = baseFilePath + req.body.origin;
    const newPath = baseFilePath + req.body.filename;
    console.log(oldPath, newPath);
    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err;
      console.log('File renamed successfully');
    });
  } catch (error) {
    console.log(error);
  }
  next();
}, catchErrors(employeeDocumentController.update));
router.route('/employeeDocument/delete/:id').delete(catchErrors(employeeDocumentController.delete));
router.route('/employeeDocument/search').get(catchErrors(employeeDocumentController.search));
router.route('/employeeDocument/list').get(catchErrors(employeeDocumentController.list));
router.route('/employeeDocument/filter').get(catchErrors(employeeDocumentController.filter));
router.route('/employeeDocument/upload').post(documentUpload.single('file'), catchErrors(employeeDocumentController._upload))
router.route('/employeeDocument/byParentId').post(catchErrors(employeeDocumentController.getByParentId));




// //_____________________________________ API for payment mode_____________________
router.route('/paymentMode/create').post(catchErrors(paymentModeController.create));
router.route('/paymentMode/read/:id').get(catchErrors(paymentModeController.read));
router.route('/paymentMode/update/:id').patch(catchErrors(paymentModeController.update));
router.route('/paymentMode/delete/:id').delete(catchErrors(paymentModeController.delete));
router.route('/paymentMode/search').get(catchErrors(paymentModeController.search));
router.route('/paymentMode/list').get(catchErrors(paymentModeController.list));
router.route('/paymentMode/filter').get(catchErrors(paymentModeController.filter));

// //_____________________________________ API for clients __________________________________________________
router.route('/client/create').post(catchErrors(clientController.create));
router.route('/client/read/:id').get(catchErrors(clientController.read));
router.route('/client/update/:id').patch(catchErrors(clientController.update));
router.route('/client/delete/:id').delete(catchErrors(clientController.delete));
router.route('/client/search').get(catchErrors(clientController.search));
router.route('/client/list').get(catchErrors(clientController.list));
router.route('/client/filter').get(catchErrors(clientController.filter));
router.route('/client/byParentId').post(catchErrors(clientController.getByParentId));
router.route('/client/upload').post(adminPhotoUpload.single('avatar'), catchErrors(clientController.upload))



// //_____________________________________ API for Assigned Employeed __________________________________________________
router.route('/assignedEmployee/create').post(catchErrors(assignedEmployeeController.create));
router.route('/assignedEmployee/read/:id').get(catchErrors(assignedEmployeeController.read));
router.route('/assignedEmployee/update/:id').patch(catchErrors(assignedEmployeeController.update));
router.route('/assignedEmployee/delete/:id').delete(catchErrors(assignedEmployeeController.delete));
router.route('/assignedEmployee/search').get(catchErrors(assignedEmployeeController.search));
router.route('/assignedEmployee/list').get(catchErrors(assignedEmployeeController.list));
router.route('/assignedEmployee/filter').get(catchErrors(assignedEmployeeController.filter));
router.route('/assignedEmployee/byParentId').post(catchErrors(assignedEmployeeController.getByParentId));

// //_____________________________________ API for Assigned Employeed __________________________________________________
router.route('/company/create').post(catchErrors(companyController.create));
router.route('/company/read/:id').get(catchErrors(companyController.read));
router.route('/company/update/:id').patch(catchErrors(companyController.update));
router.route('/company/delete/:id').delete(catchErrors(companyController.delete));
router.route('/company/search').get(catchErrors(companyController.search));
router.route('/company/list').get(catchErrors(companyController.list));
router.route('/company/filter').get(catchErrors(companyController.filter));
router.route('/company/byParentId').post(catchErrors(companyController.getByParentId));




// //_____________________________________ API for Assigned Customer __________________________________________________
router.route('/assignedCustomer/create').post(catchErrors(assignedCustomerController.create));
router.route('/assignedCustomer/read/:id').get(catchErrors(assignedCustomerController.read));
router.route('/assignedCustomer/update/:id').patch(catchErrors(assignedCustomerController.update));
router.route('/assignedCustomer/delete/:id').delete(catchErrors(assignedCustomerController.delete));
router.route('/assignedCustomer/search').get(catchErrors(assignedCustomerController.search));
router.route('/assignedCustomer/list').get(catchErrors(assignedCustomerController.list));
router.route('/assignedCustomer/filter').get(catchErrors(assignedCustomerController.filter));
router.route('/assignedCustomer/byParentId').post(catchErrors(assignedCustomerController.getByParentId));



// //_____________________________________ API for clients of customer contacts __________________________________________________
router.route('/customerContacts/create').post(catchErrors(customerContactsController.create));
router.route('/customerContacts/read/:id').get(catchErrors(customerContactsController.read));
router.route('/customerContacts/update/:id').patch(catchErrors(customerContactsController.update));
router.route('/customerContacts/delete/:id').delete(catchErrors(customerContactsController.delete));
router.route('/customerContacts/search').get(catchErrors(customerContactsController.search));
router.route('/customerContacts/list').get(catchErrors(customerContactsController.list));
router.route('/customerContacts/filter').get(catchErrors(customerContactsController.filter));
router.route('/customerContacts/byParentId').post(catchErrors(customerContactsController.getByParentId));



// //_____________________________________ API for Project of Reference contacts __________________________________________________
router.route('/reference/create').post(catchErrors(referenceController.create));
router.route('/reference/read/:id').get(catchErrors(referenceController.read));
router.route('/reference/update/:id').patch(catchErrors(referenceController.update));
router.route('/reference/delete/:id').delete(catchErrors(referenceController.delete));
router.route('/reference/search').get(catchErrors(referenceController.search));
router.route('/reference/list').get(catchErrors(referenceController.list));
router.route('/reference/filter').get(catchErrors(referenceController.filter));
router.route('/reference/byParentId').post(catchErrors(referenceController.getByParentId));



// //_____________________________________ API for Project of Reference contacts __________________________________________________
router.route('/routes/create').post(catchErrors(routesController.create));
router.route('/routes/read/:id').get(catchErrors(routesController.read));
router.route('/routes/update/:id').patch(catchErrors(routesController.update));
router.route('/routes/delete/:id').delete(catchErrors(routesController.delete));
router.route('/routes/search').get(catchErrors(routesController.search));
router.route('/routes/list').get(catchErrors(routesController.list));
router.route('/routes/filter').get(catchErrors(routesController.filter));
router.route('/routes/byParentId').post(catchErrors(referenceController.getByParentId));


// //_____________________________________ API for Project of Reference contacts __________________________________________________
router.route('/position/create').post(catchErrors(positionController.create));
router.route('/position/read/:id').get(catchErrors(positionController.read));
router.route('/position/update/:id').patch(catchErrors(positionController.update));
router.route('/position/delete/:id').delete(catchErrors(positionController.delete));
router.route('/position/search').get(catchErrors(positionController.search));
router.route('/position/list').get(catchErrors(positionController.list));
router.route('/position/filter').get(catchErrors(positionController.filter));
router.route('/position/byParentId').post(catchErrors(positionController.getByParentId));


// //_____________________________________ API for Project of Payroll __________________________________________________
router.route('/payroll/create').post(catchErrors(payrollController.create));
router.route('/payroll/read/:id').get(catchErrors(payrollController.read));
router.route('/payroll/update/:id').patch(catchErrors(payrollController.update));
router.route('/payroll/delete/:id').delete(catchErrors(payrollController.delete));
router.route('/payroll/search').get(catchErrors(payrollController.search));
router.route('/payroll/list').get(catchErrors(payrollController.list));
router.route('/payroll/filter').get(catchErrors(payrollController.filter));
router.route('/payroll/byParentId').post(catchErrors(payrollController.getByParentId));


// //_____________________________________ API for Recurrent Invoice __________________________________________________
router.route('/recurrentInvoice/create').post(catchErrors(recurrentInvoiceController.create));
router.route('/recurrentInvoice/read/:id').get(catchErrors(recurrentInvoiceController.read));
router.route('/recurrentInvoice/update/:id').patch(catchErrors(recurrentInvoiceController.update));
router.route('/recurrentInvoice/delete/:id').delete(catchErrors(recurrentInvoiceController.delete));
router.route('/recurrentInvoice/search').get(catchErrors(recurrentInvoiceController.search));
router.route('/recurrentInvoice/list').get(catchErrors(recurrentInvoiceController.list));
router.route('/recurrentInvoice/filter').get(catchErrors(recurrentInvoiceController.filter));
router.route('/recurrentInvoice/byParentId').post(catchErrors(recurrentInvoiceController.getByParentId));



// //_____________________________________ API for Invoice History __________________________________________________
router.route('/invoiceHistory/create').post(catchErrors(invoiceHistoryController.create));
router.route('/invoiceHistory/read/:id').get(catchErrors(invoiceHistoryController.read));
router.route('/invoiceHistory/update/:id').patch(catchErrors(invoiceHistoryController.update));
router.route('/invoiceHistory/delete/:id').delete(catchErrors(invoiceHistoryController.delete));
router.route('/invoiceHistory/search').get(catchErrors(invoiceHistoryController.search));
router.route('/invoiceHistory/list').get(catchErrors(invoiceHistoryController.list));
router.route('/invoiceHistory/filter').get(catchErrors(invoiceHistoryController.filter));
router.route('/invoiceHistory/byParentId').post(catchErrors(invoiceHistoryController.getByParentId));



// //_____________________________________ API for clients of customer contacts __________________________________________________
router.route('/customerStores/create').post(catchErrors(customerStoresController.create));
router.route('/customerStores/read/:id').get(catchErrors(customerStoresController.read));
router.route('/customerStores/update/:id').patch(catchErrors(customerStoresController.update));
router.route('/customerStores/delete/:id').delete(catchErrors(customerStoresController.delete));
router.route('/customerStores/search').get(catchErrors(customerStoresController.search));
router.route('/customerStores/list').get(catchErrors(customerStoresController.list));
router.route('/customerStores/filter').get(catchErrors(customerStoresController.filter));
router.route('/customerStores/byParentId').post(catchErrors(customerStoresController.getByParentId));


// //_____________________________________ API for clients of visit control __________________________________________________
router.route('/visitControl/create').post(catchErrors(visitControlController.create));
router.route('/visitControl/read/:id').get(catchErrors(visitControlController.read));
router.route('/visitControl/update/:id').patch(catchErrors(visitControlController.update));
router.route('/visitControl/delete/:id').delete(catchErrors(visitControlController.delete));
router.route('/visitControl/search').get(catchErrors(visitControlController.search));
router.route('/visitControl/list').get(catchErrors(visitControlController.list));
router.route('/visitControl/filter').get(catchErrors(visitControlController.filter));
router.route('/visitControl/byParentId').post(catchErrors(visitControlController.getByParentId));
router.route('/visitControl/upload').post(documentUpload.single('file'), catchErrors(sendMail))



// //_________________________________________________________________API for invoices_____________________
router.route('/invoice/create').post(catchErrors(invoiceController.create));
router.route('/invoice/read/:id').get(catchErrors(invoiceController.read));
router.route('/invoice/update/:id').patch(catchErrors(invoiceController.update));
router.route('/invoice/delete/:id').delete(catchErrors(invoiceController.delete));
router.route('/invoice/search').get(catchErrors(invoiceController.search));
router.route('/invoice/list').get(catchErrors(invoiceController.list));
router.route('/invoice/filter').get(catchErrors(invoiceController.filter));

router.route('/invoice/pdf/:id').get(catchErrors(invoiceController.generatePDF));

// //_________________________________________________________________API for items_____________________
router.route('/item/create').post(catchErrors(itemController.create));
router.route('/item/read/:id').get(catchErrors(itemController.read));
router.route('/item/update/:id').patch(catchErrors(itemController.update));
router.route('/item/delete/:id').delete(catchErrors(itemController.delete));
router.route('/item/search').get(catchErrors(itemController.search));
router.route('/item/list').get(catchErrors(itemController.list));
router.route('/item/filter').get(catchErrors(itemController.filter));

// //_________________________________________________________________API for Quotes_____________________

router.route('/quote/create').post(catchErrors(quoteController.create));
router.route('/quote/read/:id').get(catchErrors(quoteController.read));
router.route('/quote/update/:id').patch(catchErrors(quoteController.update));
router.route('/quote/delete/:id').delete(catchErrors(quoteController.delete));
router.route('/quote/search').get(catchErrors(quoteController.search));
router.route('/quote/list').get(catchErrors(quoteController.list));
router.route('/quote/filter').get(catchErrors(quoteController.filter));
router.route('/quote/pdf/:id').get(catchErrors(quoteController.generatePDF));

// //___________________________________________ API for suppliers _____________________
router.route('/supplier/create').post(catchErrors(supplierController.create));
router.route('/supplier/read/:id').get(catchErrors(supplierController.read));
router.route('/supplier/update/:id').patch(catchErrors(supplierController.update));
router.route('/supplier/delete/:id').delete(catchErrors(supplierController.delete));
router.route('/supplier/search').get(catchErrors(supplierController.search));
router.route('/supplier/list').get(catchErrors(supplierController.list));
router.route('/supplier/filter').get(catchErrors(supplierController.filter));

// //_________________________________________ API for order Forms _____________________

router.route('/orderForm/create').post(catchErrors(orderFormController.create));
router.route('/orderForm/read/:id').get(catchErrors(orderFormController.read));
router.route('/orderForm/update/:id').patch(catchErrors(orderFormController.update));
router.route('/orderForm/delete/:id').delete(catchErrors(orderFormController.delete));
router.route('/orderForm/search').get(catchErrors(orderFormController.search));
router.route('/orderForm/list').get(catchErrors(orderFormController.list));
router.route('/orderForm/filter').get(catchErrors(orderFormController.filter));

router.route('/orderForm/pdf/:id').get(catchErrors(orderFormController.generatePDF));

// //_________________________________________________________________API for expenses_____________________

router.route('/expense/create').post(catchErrors(expenseController.create));
router.route('/expense/read/:id').get(catchErrors(expenseController.read));
router.route('/expense/update/:id').patch(catchErrors(expenseController.update));
router.route('/expense/delete/:id').delete(catchErrors(expenseController.delete));
router.route('/expense/search').get(catchErrors(expenseController.search));
router.route('/expense/list').get(catchErrors(expenseController.list));
router.route('/expense/filter').get(catchErrors(expenseController.filter));

// //_________________________________________________________________API for expense categories________________

router.route('/expenseCategory/create').post(catchErrors(expenseCategoryController.create));
router.route('/expenseCategory/read/:id').get(catchErrors(expenseCategoryController.read));
router.route('/expenseCategory/update/:id').patch(catchErrors(expenseCategoryController.update));
router.route('/expenseCategory/delete/:id').delete(catchErrors(expenseCategoryController.delete));
router.route('/expenseCategory/search').get(catchErrors(expenseCategoryController.search));
router.route('/expenseCategory/list').get(catchErrors(expenseCategoryController.list));
router.route('/expenseCategory/filter').get(catchErrors(expenseCategoryController.filter));

// //_____________________________________________ API for client payments_________________

router.route('/paymentInvoice/create').post(catchErrors(paymentInvoiceController.create));
router.route('/paymentInvoice/read/:id').get(catchErrors(paymentInvoiceController.read));
router.route('/paymentInvoice/update/:id').patch(catchErrors(paymentInvoiceController.update));
router.route('/paymentInvoice/delete/:id').delete(catchErrors(paymentInvoiceController.delete));
router.route('/paymentInvoice/search').get(catchErrors(paymentInvoiceController.search));
router.route('/paymentInvoice/list').get(catchErrors(paymentInvoiceController.list));
router.route('/paymentInvoice/filter').get(catchErrors(paymentInvoiceController.filter));
router.route('/paymentInvoice/pdf/:id').get(catchErrors(paymentInvoiceController.generatePDF));

// //____________________________________________ API for Global Setting _________________

router.route('/settingGlobal/create').post(catchErrors(settingGlobalController.create));
router.route('/settingGlobal/read/:id').get(catchErrors(settingGlobalController.read));
router.route('/settingGlobal/update/:id').patch(catchErrors(settingGlobalController.update));
router.route('/settingGlobal/delete/:id').delete(catchErrors(settingGlobalController.delete));
router.route('/settingGlobal/search').get(catchErrors(settingGlobalController.search));
router.route('/settingGlobal/list').get(catchErrors(settingGlobalController.list));
router.route('/settingGlobal/filter').get(catchErrors(settingGlobalController.filter));


// //____________________________________________ API for Bank Account of Employee _________________
router.route('/bankAccount/create').post(catchErrors(bankAccountController.create));
router.route('/bankAccount/read/:id').get(catchErrors(bankAccountController.read));
router.route('/bankAccount/update/:id').patch(catchErrors(bankAccountController.update));
router.route('/bankAccount/delete/:id').delete(catchErrors(bankAccountController.delete));
router.route('/bankAccount/search').get(catchErrors(bankAccountController.search));
router.route('/bankAccount/list').get(catchErrors(bankAccountController.list));
router.route('/bankAccount/filter').get(catchErrors(bankAccountController.filter));
router.route('/bankAccount/byParentId').post(catchErrors(bankAccountController.getByParentId));



// //____________________________________________ API for Bank Account of Employee _________________
router.route('/vacHistory/create').post(catchErrors(vacHistoryController.create));
router.route('/vacHistory/read/:id').get(catchErrors(vacHistoryController.read));
router.route('/vacHistory/update/:id').patch(catchErrors(vacHistoryController.update));
router.route('/vacHistory/delete/:id').delete(catchErrors(vacHistoryController.delete));
router.route('/vacHistory/search').get(catchErrors(vacHistoryController.search));
router.route('/vacHistory/list').get(catchErrors(vacHistoryController.list));
router.route('/vacHistory/filter').get(catchErrors(vacHistoryController.filter));
router.route('/vacHistory/byParentId').post(catchErrors(vacHistoryController.getByParentId));




// //____________________________________________ API for Bank Account of Employee _________________
router.route('/dtmHistory/create').post(catchErrors(dtmHistoryController.create));
router.route('/dtmHistory/read/:id').get(catchErrors(dtmHistoryController.read));
router.route('/dtmHistory/update/:id').patch(catchErrors(dtmHistoryController.update));
router.route('/dtmHistory/delete/:id').delete(catchErrors(dtmHistoryController.delete));
router.route('/dtmHistory/search').get(catchErrors(dtmHistoryController.search));
router.route('/dtmHistory/list').get(catchErrors(dtmHistoryController.list));
router.route('/dtmHistory/filter').get(catchErrors(dtmHistoryController.filter));
router.route('/dtmHistory/byParentId').post(catchErrors(dtmHistoryController.getByParentId));




// //____________________________________________ API for Bank Account of Employee _________________
router.route('/replacement/create').post(catchErrors(replacementController.create));
router.route('/replacement/read/:id').get(catchErrors(replacementController.read));
router.route('/replacement/update/:id').patch(catchErrors(replacementController.update));
router.route('/replacement/delete/:id').delete(catchErrors(replacementController.delete));
router.route('/replacement/search').get(catchErrors(replacementController.search));
router.route('/replacement/list').get(catchErrors(replacementController.list));
router.route('/replacement/filter').get(catchErrors(replacementController.filter));
router.route('/replacement/byParentId').post(catchErrors(replacementController.getByParentId));






// //____________________________________________ API for Related People of Employee _________________
router.route('/relatedPeople/create').post(catchErrors(relatedPeopleController.create));
router.route('/relatedPeople/read/:id').get(catchErrors(relatedPeopleController.read));
router.route('/relatedPeople/update/:id').patch(catchErrors(relatedPeopleController.update));
router.route('/relatedPeople/delete/:id').delete(catchErrors(relatedPeopleController.delete));
router.route('/relatedPeople/search').get(catchErrors(relatedPeopleController.search));
router.route('/relatedPeople/list').get(catchErrors(relatedPeopleController.list));
router.route('/relatedPeople/filter').get(catchErrors(relatedPeopleController.filter));
router.route('/relatedPeople/byParentId').post(catchErrors(relatedPeopleController.getByParentId));




// //____________________________________________ API for Emergency Contacts of Employee _________________
router.route('/emergencyContact/create').post(catchErrors(emergencyContactController.create));
router.route('/emergencyContact/read/:id').get(catchErrors(emergencyContactController.read));
router.route('/emergencyContact/update/:id').patch(catchErrors(emergencyContactController.update));
router.route('/emergencyContact/delete/:id').delete(catchErrors(emergencyContactController.delete));
router.route('/emergencyContact/search').get(catchErrors(emergencyContactController.search));
router.route('/emergencyContact/list').get(catchErrors(emergencyContactController.list));
router.route('/emergencyContact/filter').get(catchErrors(emergencyContactController.filter));
router.route('/emergencyContact/byParentId').post(catchErrors(emergencyContactController.getByParentId));





// //____________________________________________ API for medical Details of Employee _________________
router.route('/medicalDetail/create').post(catchErrors(medicalDetailController.create));
router.route('/medicalDetail/read/:id').get(catchErrors(medicalDetailController.read));
router.route('/medicalDetail/update/:id').patch(catchErrors(medicalDetailController.update));
router.route('/medicalDetail/delete/:id').delete(catchErrors(medicalDetailController.delete));
router.route('/medicalDetail/search').get(catchErrors(medicalDetailController.search));
router.route('/medicalDetail/list').get(catchErrors(medicalDetailController.list));
router.route('/medicalDetail/filter').get(catchErrors(medicalDetailController.filter));
router.route('/medicalDetail/byParentId').post(catchErrors(medicalDetailController.getByParentId));





// //____________________________________________ API for Work Contract of Employee _________________
router.route('/workContract/create').post(catchErrors(workContractController.create));
router.route('/workContract/read/:id').get(catchErrors(workContractController.read));
router.route('/workContract/update/:id').patch(catchErrors(workContractController.update));
router.route('/workContract/delete/:id').delete(catchErrors(workContractController.delete));
router.route('/workContract/search').get(catchErrors(workContractController.search));
router.route('/workContract/list').get(catchErrors(workContractController.list));
router.route('/workContract/filter').get(catchErrors(workContractController.filter));
router.route('/workContract/byParentId').post(catchErrors(workContractController.getByParentId));













// //______________________________________________ API for Commercial Setting _________________

router.route('/settingCommercial/create').post(catchErrors(settingCommercialController.create));
router.route('/settingCommercial/read/:id').get(catchErrors(settingCommercialController.read));
router
  .route('/settingCommercial/update/:id')
  .patch(catchErrors(settingCommercialController.update));
router
  .route('/settingCommercial/delete/:id')
  .delete(catchErrors(settingCommercialController.delete));
router.route('/settingCommercial/search').get(catchErrors(settingCommercialController.search));
router.route('/settingCommercial/list').get(catchErrors(settingCommercialController.list));
router.route('/settingCommercial/filter').get(catchErrors(settingCommercialController.filter));

module.exports = router;
