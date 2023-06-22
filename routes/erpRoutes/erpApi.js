const express = require('express');
const multer = require('multer');
const path = require('path');
const setFilePathToBody = require('@/middlewares/setFilePathToBody');
const { catchErrors } = require('@/handlers/errorHandlers');

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

// //_______________________________ Admin management_______________________________

var adminPhotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/admin');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const adminPhotoUpload = multer({ storage: adminPhotoStorage });

router
  .route('/admin/create')
  .post([adminPhotoUpload.single('photo'), setFilePathToBody], catchErrors(adminController.create));
router.route('/admin/read/:id').get(catchErrors(adminController.read));
// router.route("/admin/update/:id").patch(catchErrors(adminController.update));
// router.route("/admin/delete/:id").delete(catchErrors(adminController.delete));
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
// router
//   .route("/admin/password-update/:id")
//   .patch(catchErrors(adminController.updatePassword));

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
router.route('/employee/details').post(adminPhotoUpload.single('avatar'), (req, res) => {
  console.log(req.body.avatar);
});




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



// //_____________________________________ API for Assigned Employeed __________________________________________________
router.route('/assignedEmployee/create').post(catchErrors(assignedEmployeeController.create));
router.route('/assignedEmployee/read/:id').get(catchErrors(assignedEmployeeController.read));
router.route('/assignedEmployee/update/:id').patch(catchErrors(assignedEmployeeController.update));
router.route('/assignedEmployee/delete/:id').delete(catchErrors(assignedEmployeeController.delete));
router.route('/assignedEmployee/search').get(catchErrors(assignedEmployeeController.search));
router.route('/assignedEmployee/list').get(catchErrors(assignedEmployeeController.list));
router.route('/assignedEmployee/filter').get(catchErrors(assignedEmployeeController.filter));
router.route('/assignedEmployee/byParentId').post(catchErrors(assignedEmployeeController.getByParentId));




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
