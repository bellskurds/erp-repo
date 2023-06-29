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
    dataIndex: 'period_label',
    width: '15%',
    editable: true,
  },
  {
    title: 'Total Payroll',
    dataIndex: 'payroll_amount',
    width: '15%',
    editable: true,
    render: (text) => {
      return (text || 0
      )
    }
  },
  {
    title: 'Total for services',
    dataIndex: 'services_amount',
    width: '15%',
    editable: true,
    render: (text) => {
      return (text || 0
      )
    }
  },
  {
    title: 'Total',
    dataIndex: 'total',
    width: '15%',
    editable: true,
    render: (text, record) => {
      return (record.payroll_amount || 0 + record.services_amount || 0)
    }
  },
];

const PayrollManagement = () => {
  const entity = "workContract"

  const dispatch = useDispatch();



  const [form] = Form.useForm();
  const [listItems, setListItems] = useState([]);
  const [payrollDetails, setPayrollDetails] = useState([])
  const getPeriods = (month, year, Q = 0) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 0).getDate();
    if (daysInPrevMonth === 31) {
      const Qs = ['31-15', `16-${daysInMonth === 31 ? 30 : daysInMonth}`];
      return Qs[Q];
    } else if (daysInMonth) {
      const Qs = ['1-15', `16-${daysInMonth === 31 ? 30 : daysInMonth}`];
      return Qs[Q];
    }

  }


  const getData = () => {
    const start_date = '2023/6/1';
    const end_date = new Date();
    let currentDate = moment(start_date);

    const end = moment(end_date)
    const periods = []


    while (currentDate.isSameOrBefore(end)) {

      if (currentDate.month() === end.month() && end.date() < 15) {
        periods.push({
          month: currentDate.month(),
          q: 0,
          period_label: `${currentDate.format('MMMM')}-1(${currentDate.year()})`,
          year: currentDate.year(),
          periods: getPeriods(currentDate.month(), currentDate.year(), 0),
          payroll_amount: getPaymentData(currentDate.year(), currentDate.month(), getPeriods(currentDate.month() + 1, currentDate.year(), 0))
        })
      }
      else {
        periods.push({
          month: currentDate.month(),
          q: 0,
          period_label: `${currentDate.format('MMMM')}-1(${currentDate.year()})`,
          year: currentDate.year(),
          periods: getPeriods(currentDate.month(), currentDate.year(), 0),
          payroll_amount: getPaymentData(currentDate.year(), currentDate.month(), getPeriods(currentDate.month() + 1, currentDate.year(), 0))
        },
          {
            month: currentDate.month(),
            q: 1,
            period_label: `${currentDate.format('MMMM')}-2(${currentDate.year()})`,
            year: currentDate.year(),
            periods: getPeriods(currentDate.month(), currentDate.year(), 1),
            payroll_amount: getPaymentData(currentDate.year(), currentDate.month(), getPeriods(currentDate.month() + 1, currentDate.year(), 1))
          })
      }
      currentDate = currentDate.add(1, 'months');
    }
    periods.sort((a, b) => {
      return b.year - a.year || b.month - a.month || b.q - a.q
    })
    setListItems(periods)
    console.log(periods, 'periods');

  }
  const dateValue = (date) => {
    return new Date(date).valueOf();
  }
  const getPaymentData = (year, month, periods) => {
    month++;
    console.log(year, month, periods, 'year, month, periods');
    const startDay = parseInt(periods.split("-")[0]);
    const endDay = parseInt(periods.split("-")[1]);
    const start_date = new Date(year, startDay === 31 ? (month - 2) : (month - 1), startDay);
    const end_date = new Date(year, month - 1, endDay);


    const _listItems = payrollDetails.filter(obj =>
      obj.status === "active" &&
      (
        (
          dateValue(obj.start_date) <= dateValue(start_date) &&
          dateValue(obj.end_date) >= dateValue(end_date)
        )
        ||
        (
          dateValue(obj.start_date) > dateValue(start_date) &&
          dateValue(obj.start_date) < dateValue(end_date) &&
          dateValue(obj.end_date) >= dateValue(end_date)
        )
      )
    )
    let calValue = 0;
    _listItems.map(obj => {
      if (obj.type === 1) {
        calValue += parseFloat(obj.week_pay)
      }
    })
    return calValue

  }

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  const { pagination, items } = listResult;
  useEffect(() => {

    items.map(obj => {
      obj.hrs_bi = obj.type === 1 ? mathCeil(obj.hr_week * 4.333 / 2) : 0;
      obj.week_pay = obj.type === 1 ? mathCeil(obj.hr_week * 4.333 / 2) : 0;
    })
    setPayrollDetails(items)
  }, [
    items
  ])
  const mathCeil = (value) => {
    return value.toFixed(2)
  }

  useEffect(() => {

    getData()
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
              rowKey={(item) => item.id}
              key={(item) => item._id}
              dataSource={listItems || []}
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