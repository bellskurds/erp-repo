import { DashboardLayout, DefaultLayout } from '@/layout';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Layout, Modal, Popconfirm, Row, Space, Table, Tag, Typography } from 'antd';

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import moment from 'moment';
import { request } from '@/request';
import { Link } from 'react-router-dom/cjs/react-router-dom';
const mathCeil = (value) => {
  return value.toFixed(2)
}
const columns = [
  {
    title: 'Period',
    dataIndex: 'period_label',
    width: '15%',
    editable: true,
    render: (text, row) => {
      return (

        <Typography.Text>
          <Link to={`/payroll_details/${row.year}-${row.month + 1}-${row.q}`}>{text}</Link>
        </Typography.Text>
      )
    }
  },
  {
    title: 'Total Payroll',
    dataIndex: 'payroll_amount',
    width: '15%',
    editable: true,
    render: (text) => {
      return (mathCeil(text) || 0
      )
    }
  },
  {
    title: 'Total for services',
    dataIndex: 'services_amount',
    width: '15%',
    editable: true,
    render: (text) => {
      return (mathCeil(text) || 0
      )
    }
  },
  {
    title: 'Total',
    dataIndex: 'total',
    width: '15%',
    editable: true,
    render: (text, record) => {

      return (mathCeil(record.payroll_amount + record.services_amount))
    }
  },
];

const PayrollManagement = () => {
  const entity = "workContract"

  const dispatch = useDispatch();



  const [form] = Form.useForm();
  const [listItems, setListItems] = useState([]);
  const [payrollDetails, setPayrollDetails] = useState([])
  const [allHours, setAllHours] = useState([]);
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

  useEffect(() => {

  }, [payrollDetails])
  const getData = async () => {
    const start_date = '2023/06/1';
    const end_date = new Date();
    let currentDate = moment(new Date(start_date));

    const end = moment(end_date)
    const periods = []

    const { result: assignedEmployee } = await request.list({ entity: "assignedEmployee" });
    const { result: allHours } = await request.list({ entity: 'payroll' });
    const { result: workContracts } = await request.list({ entity: "workContract" })

    while (currentDate.isSameOrBefore(end)) {

      if (currentDate.month() === end.month() && end.date() < 15) {
        periods.push({
          id: new Date().valueOf(),
          month: currentDate.month(),
          q: 0,
          period_label: `${currentDate.format('MMMM')}-1(${currentDate.year()})`,
          year: currentDate.year(),
          periods: getPeriods(currentDate.month(), currentDate.year(), 0),
          payroll_amount: getPaymentData(JSON.parse(JSON.stringify(assignedEmployee)), allHours, workContracts, currentDate.year(), currentDate.month(), getPeriods(currentDate.month() + 1, currentDate.year(), 0), 1),
          services_amount: getPaymentData(JSON.parse(JSON.stringify(assignedEmployee)), allHours, workContracts, currentDate.year(), currentDate.month(), getPeriods(currentDate.month() + 1, currentDate.year(), 0), 2)
        })
      }
      else {
        periods.push({
          id: new Date().valueOf(),
          month: currentDate.month(),
          q: 0,
          period_label: `${currentDate.format('MMMM')}-1(${currentDate.year()})`,
          year: currentDate.year(),
          periods: getPeriods(currentDate.month(), currentDate.year(), 0),
          payroll_amount: getPaymentData(JSON.parse(JSON.stringify(assignedEmployee)), allHours, workContracts, currentDate.year(), currentDate.month(), getPeriods(currentDate.month() + 1, currentDate.year(), 0), 1)
          ,
          services_amount: getPaymentData(JSON.parse(JSON.stringify(assignedEmployee)), allHours, workContracts, currentDate.year(), currentDate.month(), getPeriods(currentDate.month() + 1, currentDate.year(), 0), 2)

        },
          {
            id: new Date().valueOf() + 1,
            month: currentDate.month(),
            q: 1,
            period_label: `${currentDate.format('MMMM')}-2(${currentDate.year()})`,
            year: currentDate.year(),
            periods: getPeriods(currentDate.month(), currentDate.year(), 1),
            payroll_amount: getPaymentData(JSON.parse(JSON.stringify(assignedEmployee)), allHours, workContracts, currentDate.year(), currentDate.month(), getPeriods(currentDate.month() + 1, currentDate.year(), 1), 1)
            ,
            services_amount: getPaymentData(JSON.parse(JSON.stringify(assignedEmployee)), allHours, workContracts, currentDate.year(), currentDate.month(), getPeriods(currentDate.month() + 1, currentDate.year(), 1), 2)

          })
      }
      currentDate = currentDate.add(1, 'months');
    }
    periods.sort((a, b) => {
      return b.year - a.year || b.month - a.month || b.q - a.q
    })
    periods.map((obj, index) => {
      obj.key = index
    })
    setListItems(periods)
  }
  const dateValue = (date) => {
    return new Date(date).valueOf();
  }
  const changedCellValue = (hours, date, record) => {
    const { contract: { _id: contract_id }, employee: { _id: employee_id }, parent_id: { _id: customer_id } } = record;
    const item = hours.find(obj => obj.contract === contract_id && obj.employee === employee_id && obj.customer === customer_id && obj.date === date);
    if (item) {
      return item.hour
    } else {
      return false;
    }
  }
  const getHours = (dates) => {
    const hours = dates.map(date => moment(date).hour());
    const maxHour = Math.max(...hours);
    const minHour = Math.min(...hours);
    const difference = maxHour - minHour;
    return (difference)
  }
  const getPaymentData = (_assignedEmployees, Hours, workContracts, year, month, periods, payType = 1) => {
    month++;
    const unassignedContracts = [];
    const assignedContracts = [];
    const startDay = parseInt(periods.split("-")[0]);
    const endDay = parseInt(periods.split("-")[1]);
    const start_date = new Date(year, startDay === 31 ? (month - 2) : (month - 1), startDay);
    const end_date = new Date(year, month - 1, endDay);
    const _listItems = _assignedEmployees.filter(({ contract }) =>
      Object(contract).hasOwnProperty("status") && contract.status === "active" &&
      (
        (
          dateValue(contract.start_date) <= dateValue(start_date) &&
          dateValue(contract.end_date) >= dateValue(end_date)
        )
        ||
        (
          dateValue(contract.start_date) > dateValue(start_date) &&
          dateValue(contract.start_date) < dateValue(end_date) &&
          dateValue(contract.end_date) >= dateValue(end_date)
        )
      )
    )
    _listItems.map((obj, index) => {

      const { contract: assignedContract } = obj;
      if (assignedContract.type === payType) {
        obj.sunday_hr = obj.sunday ? getHours(obj.sunday) : 0;
        obj.monday_hr = obj.monday ? getHours(obj.monday) : 0;
        obj.tuesday_hr = obj.tuesday ? getHours(obj.tuesday) : 0;
        obj.wednesday_hr = obj.wednesday ? getHours(obj.wednesday) : 0;
        obj.thursday_hr = obj.thursday ? getHours(obj.thursday) : 0;
        obj.friday_hr = obj.friday ? getHours(obj.friday) : 0;
        obj.saturday_hr = obj.saturday ? getHours(obj.saturday) : 0;


        let currentDate = moment(start_date);

        const end = moment(end_date);

        while (currentDate.isSameOrBefore(end)) {
          const day = currentDate.date();
          const _day = currentDate.day();
          const year = currentDate.year();
          const month = currentDate.month();
          const dataIndex = `-day-${year}_${month + 1}_${day}`;
          const dataIndex1 = `_day-${year}_${month + 1}_${day}`;
          switch (_day) {
            case 0:
              obj[dataIndex] = changedCellValue(Hours, `${year}/${month + 1}/${day}`, obj) || obj.sunday_hr;
              obj[dataIndex1] = (changedCellValue(Hours, `${year}/${month + 1}/${day}`, obj) || obj.sunday_hr) - obj.sunday_hr
              break;

            case 1:
              obj[dataIndex] = changedCellValue(Hours, `${year}/${month + 1}/${day}`, obj) || obj.monday_hr;
              obj[dataIndex1] = (changedCellValue(Hours, `${year}/${month + 1}/${day}`, obj) || obj.monday_hr) - obj.monday_hr

              break;

            case 2:
              obj[dataIndex] = changedCellValue(Hours, `${year}/${month + 1}/${day}`, obj) || obj.tuesday_hr;

              obj[dataIndex1] = (changedCellValue(Hours, `${year}/${month + 1}/${day}`, obj) || obj.tuesday_hr) - obj.tuesday_hr

              break;

            case 3:
              obj[dataIndex] = changedCellValue(Hours, `${year}/${month + 1}/${day}`, obj) || obj.wednesday_hr;
              obj[dataIndex1] = (changedCellValue(Hours, `${year}/${month + 1}/${day}`, obj) || obj.wednesday_hr) - obj.wednesday_hr

              break;

            case 4:
              obj[dataIndex] = changedCellValue(Hours, `${year}/${month + 1}/${day}`, obj) || obj.thursday_hr;
              obj[dataIndex1] = (changedCellValue(Hours, `${year}/${month + 1}/${day}`, obj) || obj.thursday_hr) - obj.thursday_hr

              break;
            case 5:
              obj[dataIndex] = changedCellValue(Hours, `${year}/${month + 1}/${day}`, obj) || obj.friday_hr;
              obj[dataIndex1] = (changedCellValue(Hours, `${year}/${month + 1}/${day}`, obj) || obj.friday_hr) - obj.friday_hr


              break;
            case 6:
              obj[dataIndex] = changedCellValue(Hours, `${year}/${month + 1}/${day}`, obj) || obj.saturday_hr;
              obj[dataIndex1] = (changedCellValue(Hours, `${year}/${month + 1}/${day}`, obj) || obj.saturday_hr) - obj.saturday_hr

              break;

            default:
              break;
          }
          currentDate = currentDate.add(1, 'days');
        };
        obj.hrs_bi = assignedContract.type === 1 ? mathCeil(obj.hr_week * 4.333 / 2) : getServiceHours(obj);
        obj.week_pay = mathCeil(obj.hrs_bi * obj.sal_hr)
        obj.adjustment = calcAdjustment(obj);
        obj.adjust = calcAdjustment(obj) * obj.sal_hr;
        obj.salary = parseFloat(obj.adjust) + parseFloat(obj.week_pay);
        obj.transferencia = assignedContract.type === 1 ? obj.salary : obj.salary * 0.89;
      }
    });

    _assignedEmployees.map(obj => {
      const { contract: assignedContract } = obj;
      assignedContracts.push(assignedContract);
    })
    const filteredWorkContracts = workContracts.filter(obj =>
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
    workContracts.map(obj => {
      obj.hrs_bi = obj.type === 1 ? mathCeil(obj.hr_week * 4.333 / 2) : 0;
      obj.week_pay = obj.type === 1 ? mathCeil(obj.hr_week * 4.333 / 2) : 0;
    })

    filteredWorkContracts.map(contract => {
      const item = assignedContracts.filter(obj => (Object(obj).hasOwnProperty('_id') && obj._id === contract._id));
      if (!item.length) {
        contract.employee = contract.parent_id
        contract.contract = { type: contract.type };
        contract.adjustment = 0;
        contract.adjust = 0;
        contract.salary = contract.week_pay;
        contract.transferencia = contract.type === 1 ? (contract.salary) : contract.salary * 0.89
        unassignedContracts.push(contract)
      }
    })




    let calValue = 0;
    [..._listItems, ...unassignedContracts].map(obj => {
      const { contract } = obj;
      if (contract.type === payType) {
        calValue += (parseFloat(obj.week_pay))
      }
    })
    return calValue;
  }
  const calcAdjustment = (record) => {
    var adjust = 0;
    for (var key in record) {
      if (key.includes('_day-')) {
        adjust += record[key];
      }
    }
    return adjust;
  }
  const getServiceHours = (record) => {
    var hours = 0;
    for (var key in record) {
      if (key.includes('-day-')) {
        hours += record[key];
      }
    }
    return hours;
  }


  useEffect(() => {
    async function init() {
      const { result } = await request.list({ entity });
      const { result: allHours } = await request.list({ entity });
      setPayrollDetails(result);
      setAllHours(allHours)
    }
    getData();
    init();
  }, []);


  return (

    <DashboardLayout>
      <Layout style={{ minHeight: ' 100vh' }}>

        <Layout>
          <Form form={form} component={false}>
            <Table
              bordered
              // rowKey={new Date().valueOf()}
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