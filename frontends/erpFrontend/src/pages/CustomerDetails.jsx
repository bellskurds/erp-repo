import React, { useRef, useState } from 'react';
import { Form, Input, InputNumber, Space, Divider, Row, Col, Tabs } from 'antd';

import { Layout, Breadcrumb, Statistic, Progress, Tag } from 'antd';

import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

import { DashboardLayout } from '@/layout';
import RecentTable from '@/components/RecentTable';


export default function CustomerDetails() {
  const entity = 'invoice213';
  const dataTableColumns = [
    {
      title: 'N#',
      dataIndex: 'number',
    },
    {
      title: 'Client',
      dataIndex: ['client', 'company'],
    },

    {
      title: 'Total',
      dataIndex: 'total',

      render: (total) => `$ ${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        let color = status === 'Draft' ? 'volcano' : 'green';

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
  ];
  const bankColumns = [
    {
      title: 'Bank',
      dataIndex: 'number',
    },
    {
      title: 'Account type',
      dataIndex: ['client', 'company'],
    },

    {
      title: 'Name',
      dataIndex: 'total',

      render: (total) => `$ ${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    },
    {
      title: 'Account No',
      dataIndex: 'status',
      render: (status) => {
        let color = status === 'Draft' ? 'volcano' : 'green';

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
  ];
  const relatedColumns = [
    {
      title: 'Name',
      dataIndex: 'number',
    },
    {
      title: 'Last Name',
      dataIndex: ['client', 'company'],
    },

    {
      title: 'Relation',
      dataIndex: 'total',

      render: (total) => `$ ${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    },
    {
      title: 'Contact',
      dataIndex: 'status',
      render: (status) => {
        let color = status === 'Draft' ? 'volcano' : 'green';

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Address',
      dataIndex: 'total',

      render: (total) => `$ ${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    },
  ];
  const emergencyColumns = [
    {
      title: 'Name',
      dataIndex: 'number',
    },
    {
      title: 'Last Name',
      dataIndex: ['client', 'company'],
    },

    {
      title: 'Phone',
      dataIndex: 'total',

      render: (total) => `$ ${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    },
  ];
  const medicalColumns = [
    {
      title: 'Type',
      dataIndex: 'number',
    },
    {
      title: 'Description',
      dataIndex: ['client', 'company'],
    },
  ];
  const contractColumns = [
    {
      title: 'Start',
      dataIndex: 'number',
    },
    {
      title: 'End',
      dataIndex: 'number',
    },
    {
      title: 'Sal/Hr',
      dataIndex: 'number',
    },
    {
      title: 'Hr/Week',
      dataIndex: 'number',
    },
    {
      title: 'Sal/Monthly',
      dataIndex: ['client', 'company'],
    },
    {
      title: 'status',
      dataIndex: ['client', 'company'],
    },
  ];
  const contactsColumns = [
    {
      title: 'Name',
      dataIndex: 'number',
    },
    {
      title: 'Position',
      dataIndex: 'number',
    },
    {
      title: 'Email',
      dataIndex: 'number',
    },
    {
      title: 'Phone',
      dataIndex: 'number',
    },

  ];
  const scheduleColumns = [
    {
      title: 'Hours',
      dataIndex: 'number',
    },
    {
      title: 'Monday',
      dataIndex: 'number',
    },
    {
      title: 'Tuesday',
      dataIndex: 'number',
    },
    {
      title: 'Wednesday',
      dataIndex: 'number',
    },
    {
      title: 'Tursday',
      dataIndex: ['client', 'company'],
    },
    {
      title: 'Friday',
      dataIndex: ['client', 'company'],
    },
    {
      title: 'Saturday',
      dataIndex: ['client', 'company'],
    },
    {
      title: 'Sunday',
      dataIndex: ['client', 'company'],
    },
  ];
  const paymentColumns = [
    {
      title: 'Date',
      dataIndex: 'number',
    },
    {
      title: 'Fortnight',
      dataIndex: 'number',
    },
    {
      title: 'Total Amount',
      dataIndex: 'number',
    },
    {
      title: 'Net Amount',
      dataIndex: 'number',
    },
  ];
  const storesColumns = [
    {
      title: 'Store',
      dataIndex: 'number',
    },
    {
      title: 'Hours',
      dataIndex: 'number',
    },
    {
      title: 'Hr/week',
      dataIndex: 'number',
    },
    {
      title: 'Location',
      dataIndex: 'number',
    },
    {
      title: 'Billing',
      dataIndex: 'number',
    },
    {
      title: 'Products',
      dataIndex: 'number',
    },
  ];
  const assignedEmployeeColumns = [
    {
      title: 'Name',
      dataIndex: 'number',
    },
    {
      title: 'Branch',
      dataIndex: 'number',
    },
    {
      title: 'Time',
      dataIndex: 'number',
    },
    {
      title: 'Hr/week',
      dataIndex: 'number',
    },
    {
      title: 'Type',
      dataIndex: 'number',
    },
    {
      title: 'Sal/hr',
      dataIndex: 'number',
    },
  ];
  const documentsColumns = [
    {
      title: 'Name',
      dataIndex: 'number',
    },
    {
      title: 'Date',
      dataIndex: 'number',
    },
    {
      title: 'Comments',
      dataIndex: 'number',
    },
    {
      title: 'By',
      dataIndex: 'number',
    },
  ];
  const recurrentBillingColumns = [
    {
      title: 'Description',
      dataIndex: 'number',
    },
    {
      title: 'Amount',
      dataIndex: 'number',
    },
    {
      title: 'taxes',
      dataIndex: 'number',
    },
    {
      title: 'Frequency',
      dataIndex: 'number',
    },
    {
      title: 'Start',
      dataIndex: 'number',
    },
    {
      title: 'End',
      dataIndex: 'number',
    },
  ];
  const InvoiceHistoryColumns = [
    {
      title: 'Date',
      dataIndex: 'number',
    },
    {
      title: 'Description',
      dataIndex: 'number',
    },
    {
      title: 'Amount',
      dataIndex: 'number',
    },
    {
      title: 'Details',
      dataIndex: 'number',
    },
  ];
  const BillingEstimationColumns = [
    {
      title: 'Month',
      dataIndex: 'number',
    },
    {
      title: 'Amount',
      dataIndex: 'number',
    },
  ];

  return (
    <DashboardLayout>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Details" key="1">
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Contacts</h3>
            </div>

            <RecentTable entity={'banks'} dataTableColumns={contactsColumns} />
          </div>

          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Stores</h3>
            </div>
            <RecentTable entity={'quote'} dataTableColumns={storesColumns} />
          </div>

          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Assigned Employees</h3>
            </div>
            <RecentTable entity={'quote'} dataTableColumns={assignedEmployeeColumns} />
          </div>

        </Tabs.TabPane>
        <Tabs.TabPane tab="Documentes" key="2">
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Documents</h3>
            </div>

            <RecentTable entity={'invoice'} dataTableColumns={documentsColumns} />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Biling" key="3">
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Recurrent Billing</h3>
            </div>

            <RecentTable entity={'invoice'} dataTableColumns={recurrentBillingColumns} />
          </div>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Invoice History</h3>
            </div>

            <RecentTable entity={'invoice'} dataTableColumns={InvoiceHistoryColumns} />
          </div>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Billing Estimation</h3>
            </div>

            <RecentTable entity={'invoice'} dataTableColumns={BillingEstimationColumns} />
          </div>
        </Tabs.TabPane>
      </Tabs>

    </DashboardLayout>
  );
}
