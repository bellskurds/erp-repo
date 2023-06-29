import { DashboardLayout, DefaultLayout } from '@/layout';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Layout, Modal, Popconfirm, Row, Space, Table, Tag, Typography } from 'antd';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import moment from 'moment';
const columns = [
  {
    title: 'Period',
    dataIndex: 'personal_id',
    width: '15%',
    editable: true,
  },
  {
    title: 'Total Payroll',
    dataIndex: 'name',
    width: '15%',
    editable: true,
  },
  {
    title: 'Total for services',
    dataIndex: 'email',
    width: '15%',
    editable: true,
  },
  {
    title: 'Total',
    dataIndex: 'phone',
    width: '15%',
    editable: true,
  },
];

const PayrollManagement = () => {
  const entity = "workContract"

  const dispatch = useDispatch();



  const [form] = Form.useForm();
  const [listItems, setListItems] = useState([]);
  const [initMonth, setInitMonth] = useState(6);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [initQ, initCurrentQ] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);

  const getPeriods = (month, year, Q = 0) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 0).getDate();
    if (daysInPrevMonth === 31) {
      const Qs = ['31-15', `16-${daysInMonth === 31 ? 30 : daysInMonth}`];
      console.log(Qs, 'daysInPrevMonth, daysInMonth');
      return Qs[Q];
    } else if (daysInMonth) {
      const Qs = ['1-15', `16-${daysInMonth === 31 ? 30 : daysInMonth}`];
      console.log(Qs, 'd22aysInPrevMonth, daysInMonth');

      return Qs[Q];
    }

  }
  const getQ = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    if (currentDay > 15) {
      return 1
    } else {
      return 0
    }
  }

  const getData = () => {
    const start_date = '2023/6/1';
    const end_date = new Date();
    let currentDate = moment(start_date);

    const end = moment(end_date)
    const invoices = []
    while (currentDate.isSameOrBefore(end)) {
      // invoices.push(currentDate.format('MM/DD/YYYY'));

      invoices.push({
        start_date: currentDate.format('MM/DD/YYYY'),
      })
      currentDate = currentDate.add(2, 'weeks');
    }
    console.log(invoices);
  }
  getData()


  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  const { pagination, items } = listResult;
  useEffect(() => {

    console.log(items, 'itemsitemsitemsitemsitemsitemsitems');
    items.map(obj => {
      obj.hrs_bi = obj.type === 1 ? mathCeil(obj.hr_week * 4.333 / 2) : 0;
      obj.week_pay = obj.type === 1 ? mathCeil(obj.hr_week * 4.333 / 2) : 0;
    })


    setListItems(items)
  }, [
    items
  ])
  const mathCeil = (value) => {
    return value.toFixed(2)
  }

  useEffect(() => {
    dispatch(crud.resetState())
    dispatch(crud.list({ entity }));
  }, []);


  return (

    <DashboardLayout>
      <Layout style={{ minHeight: '100vh' }}>

        <Layout>
          <Form form={form} component={false}>
            <Table
              bordered
              rowKey={(item) => item._id}
              key={(item) => item._id}
              dataSource={[]}
              columns={columns}
              rowClassName="editable-row"


            />
          </Form>


        </Layout>
      </Layout>
    </DashboardLayout>
  );
};
export default PayrollManagement;