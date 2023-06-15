import React, { useRef, useState } from 'react';
import { Form, Input, InputNumber, Space, Divider, Row, Col, Tabs } from 'antd';

import { Layout, Breadcrumb, Statistic, Progress, Tag } from 'antd';

import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

import { DashboardLayout } from '@/layout';
import RecentTable from '@/components/RecentTable';


export default function Details() {
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
  const customerColumns = [
    {
      title: 'Customer',
      dataIndex: 'number',
    },
    {
      title: 'Store',
      dataIndex: 'number',
    },
    {
      title: 'Hours',
      dataIndex: 'number',
    },
    {
      title: 'Hr/Week',
      dataIndex: 'number',
    },
    {
      title: 'Sal/Hr',
      dataIndex: ['client', 'company'],
    },
    {
      title: 'Type',
      dataIndex: ['client', 'company'],
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
  const config = { entity, dataTableColumns };

  return (
    <DashboardLayout>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Details" key="1">
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Bank Account</h3>
            </div>

            <RecentTable entity={'banks'} dataTableColumns={bankColumns} />
          </div>

          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Related People</h3>
            </div>
            <RecentTable entity={'quote'} dataTableColumns={relatedColumns} />
          </div>

          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Emergency Contacts</h3>
            </div>
            <RecentTable entity={'quote'} dataTableColumns={emergencyColumns} />
          </div>

          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Medical Details</h3>
            </div>
            <RecentTable entity={'quote'} dataTableColumns={medicalColumns} />
          </div>

          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Work Contract</h3>
            </div>
            <RecentTable entity={'quote'} dataTableColumns={contractColumns} />
          </div>

        </Tabs.TabPane>
        <Tabs.TabPane tab="Work" key="2">
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Assigned Customers</h3>
            </div>

            <RecentTable entity={'invoice'} dataTableColumns={customerColumns} />
          </div>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Schedule</h3>
            </div>
            <RecentTable entity={'quote'} dataTableColumns={scheduleColumns} />
          </div>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Payment history</h3>
            </div>
            <RecentTable entity={'quote'} dataTableColumns={paymentColumns} />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Documents" key="3">
          Content of Tab Pane 3
        </Tabs.TabPane>
      </Tabs>

    </DashboardLayout>
  );
}
