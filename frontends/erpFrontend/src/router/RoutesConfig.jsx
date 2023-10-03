import React from 'react';
// import {
//   DesktopOutlined,
//   SettingOutlined,
//   CustomerServiceOutlined,
//   FileTextOutlined,
//   FileSyncOutlined,
//   DashboardOutlined,
//   TeamOutlined,
//   UserOutlined,
//   CreditCardOutlined,
//   BankOutlined,
// } from "@ant-design/icons";

// export const IconMenu = ({ name }) => {
//   const components = {
//     DesktopOutlined: DesktopOutlined,
//     SettingOutlined: SettingOutlined,
//     CustomerServiceOutlined: CustomerServiceOutlined,
//     FileTextOutlined: FileTextOutlined,
//     FileSyncOutlined: FileSyncOutlined,
//     DashboardOutlined: DashboardOutlined,
//     TeamOutlined: TeamOutlined,
//     UserOutlined: UserOutlined,
//     CreditCardOutlined: CreditCardOutlined,
//     BankOutlined: BankOutlined,
//     Default: DesktopOutlined,
//   };

//   const IconTag = components[name || "Default"] || SettingOutlined;
//   return <IconTag />;
// };
const { role } = window.localStorage.auth ? JSON.parse(window.localStorage.auth) : {};



var routes = [
  {
    path: '/',
    component: 'Dashboard',
  },
  {
    path: '/customer',
    component: 'Customer',
  },
  {
    path: '/invoice',
    component: 'Invoice',
  },
  {
    path: '/employee/details/:id',
    component: 'Details',
  },
  {
    path: '/customer/details/:id',
    component: 'CustomerDetails',
  },
  {
    path: '/customer_details',
    component: 'CustomerDetails',
  },
  {
    path: '/payroll_management',
    component: 'PayrollManagement',
  },
  {
    path: '/project_payment_management',
    component: 'ProjectPaymentManagement',
  },
  {
    path: '/payroll_details/:id',
    component: 'PayrollDetails',
  },
  {
    path: '/project_details/:id',
    component: 'ProjectDetails',
  },
  {
    path: '/Projects',
    component: 'Projects',
  },
  {
    path: '/visit_control',
    component: 'VisitControl',
  },
  {
    path: '/store',
    component: 'Store',
  },
  {
    path: '/quote',
    component: 'Quote',
  },
  {
    path: '/payment/invoice',
    component: 'PaymentInvoice',
  },
  {
    path: '/employee',
    component: 'Employee',
  },
  {
    path: '/admin',
    component: 'Admin',
  },
  {
    path: '/company',
    component: 'Company',
  },
  {
    path: '/payment/mode',
    component: 'PaymentMode',
  },
  {
    path: '/role',
    component: 'Role',
  },
  {
    path: '/ref',
    component: 'Reference',
  },
  {
    path: '/position',
    component: 'Position',
  },
  {
    path: '/comparative_Report',
    component: 'ComparativeReport',
  },
  {
    path: '/billing_report',
    component: 'BillingReport',
  },
  {
    path: '/routes',
    component: 'Routes',
  },
  {
    path: '/recurrent_payment_report',
    component: 'RecurrentPaymentReport',
  },
]



export const routesConfig = routes
export const Role = role;