import { DashboardLayout, DefaultLayout } from '@/layout';
import { DeleteOutlined, EditOutlined, EyeOutlined, LeftOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Layout, Modal, Popconfirm, Row, Space, Table, Tag, Typography } from 'antd';
import Search from 'antd/lib/transfer/search';
import React, { useEffect, useRef, useState } from 'react';
import CustomModal from 'modules/CustomModal'
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import moment from 'moment';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { request } from '@/request';
const contractTypes = [
  "", "Payroll", "Services"
]
const getFormattedHours = (days) => {
  const dayLabels = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];
  const hours = [];

  for (let i = 0; i < days.length; i++) {
    if (!days[i]) continue
    const [start, end] = days[i];

    if (start === end) {
      hours.push(dayLabels[i] + ' ' + new Date(start).getHours());
    } else if (i === 0 || start !== days[i - 1][0] || end !== days[i - 1][1]) {
      hours.push(dayLabels[i] + '( ' + new Date(start).getHours() + '-' + new Date(end).getHours() + ')');
    }
  }
  return hours.join(', ');
}

const columns = [
  {
    title: 'Customer',
    dataIndex: ['parent_id', 'name'],
    width: '100',
    editable: true,
  },
  {
    title: 'Employee',
    dataIndex: ['employee', 'name'],
    width: '100',
    editable: true,
  },
  {
    title: 'Hours',
    dataIndex: 'email',
    width: '200',
    editable: true,
    render: (text, record) => (
      <>
        {getFormattedHours(
          [
            record.monday ? [record.monday[0], record.monday[1]] : "",
            record.tuesday ? [record.tuesday[0], record.tuesday[1]] : "",
            record.wednesday ? [record.wednesday[0], record.wednesday[1]] : "",
            record.thursday ? [record.thursday[0], record.thursday[1]] : "",
            record.friday ? [record.friday[0], record.friday[1]] : "",
            record.saturday ? [record.saturday[0], record.saturday[1]] : "",
            record.sunday ? [record.sunday[0], record.sunday[1]] : "",
          ]
        )}
      </>
    ),
  },
  {
    title: 'HR/Week',
    dataIndex: 'hr_week',
    width: '100',
    editable: true,
  },
  {
    title: 'Type',
    dataIndex: ['contract', 'type'],
    width: '100',
    editable: true,
    render: (text) => {
      return (
        contractTypes[text]
      );
    },
  },
  {
    title: 'Sal/Hr',
    dataIndex: 'sal_hr',
    width: '100',
    editable: true,
  },
  {
    title: 'Hrs/BiWeekly',
    width: '100',
    dataIndex: ['contract', 'hrs_bi'],
    editable: true,
  },
  {
    title: 'Week Pay',
    dataIndex: ['contract', 'week_pay'],
    width: '25',
    editable: true,
  },
  {
    title: 'Adjustment',
    dataIndex: 'phone',
    width: '100',
    editable: true,
  },
  {
    title: 'Adjust($$$)',
    dataIndex: 'phone',
    width: '100',
    editable: true,
  },
  {
    title: 'Salary',
    dataIndex: 'phone',
    width: '100',
    editable: true,
    render: (text, record) => {
      return (
        record.type === 1 ? mathCeil((record.hr_week * 4.333 / 2) * record.sal_hr) : 0
      );
    }

  },
];

const mathCeil = (value) => {
  return value.toFixed(2)
}
const PayrollDetails = () => {
  const entity = "workContract"
  const url = useParams().id;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isUpdate, setIsUpdate] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
    setIsUpdate(false);
    if (formRef.current) formRef.current.resetFields();
  };
  const dispatch = useDispatch();

  const handleOk = () => {
    // handle ok button click here
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [currentId, setCurrentId] = useState('');
  const [currentItem, setCurrentItem] = useState({});

  const [currentMonth, setCurrentMonth] = useState(parseInt(url.split("-")[1]));
  const [currentYear, setCurrentYear] = useState(parseInt(url.split("-")[0]));
  const [currentQ, setCurrentQ] = useState(parseInt(url.split("-")[2]));
  const [currentBiWeek, setCurrentBiweek] = useState(new Date())
  const [currentPeriod, setCurrentPeriod] = useState('1-15')
  const [changedDays, setChangedDays] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [currentColumns, setCurrentColumns] = useState(columns)
  const isEditing = (record) => record._id === editingKey;
  const editItem = (item) => {
    if (item) {
      setTimeout(() => {
        if (formRef.current) formRef.current.setFieldsValue(item);
      }, 400);
      setCurrentId(item._id);
      setCurrentItem(item);
      setIsModalVisible(true);
      setIsUpdate(true);
    }
  }
  const deleteItem = (item) => {
    const id = item._id;
    dispatch(crud.delete({ entity, id }))
    setTimeout(() => {
      dispatch(crud.list({ entity }));
    }, 1000)
  }

  const navigateBiWeeks = (date, direction) => {
    const newDate = new Date(date);
    if (direction === 'previous') {
      newDate.setDate(newDate.getDate() - 15);
    } else if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 15);
    }
    setCurrentBiweek(newDate);
    return newDate;
  }

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


  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  const { pagination, items } = listResult;
  const [listItems, setListItems] = useState([]);
  const formRef = useRef(null);
  const getHours = (dates) => {
    const hours = dates.map(date => moment(date).hour());
    const maxHour = Math.max(...hours);
    const minHour = Math.min(...hours);
    const difference = maxHour - minHour;
    return (difference)
  }

  const prevData = () => {
    if (currentQ) {
      setCurrentQ(0)
    } else {
      if (currentMonth === 1) {
        setCurrentYear(currentYear - 1);
        setCurrentMonth(12)
      }
      setCurrentMonth(currentMonth - 1);
      setCurrentQ(1);
    }
  }
  const nextData = () => {
    if (currentQ) {
      setCurrentMonth(currentMonth + 1);
      setCurrentQ(0);
      if (currentMonth === 12) {
        setCurrentYear(currentYear + 1);
        setCurrentMonth(1);
      }
    } else {
      setCurrentQ(1)
    }
  }
  useEffect(() => {
    console.log(11);
    setCurrentPeriod(getPeriods(currentMonth, currentYear, currentQ))


  }, [currentMonth, currentQ, currentYear])



  const dateValue = (date) => {
    return new Date(date).valueOf();
  }
  useEffect(() => {
    async function init() {

      const startDay = parseInt(currentPeriod.split("-")[0]);
      const endDay = parseInt(currentPeriod.split("-")[1]);
      const start_date = new Date(currentYear, startDay === 31 ? (currentMonth - 2) : (currentMonth - 1), startDay);
      const end_date = new Date(currentYear, currentMonth - 1, endDay);

      let currentDate = moment(start_date);
      var date = new Date(start_date);
      date.setMonth(date.getMonth() + 12);
      const end = moment(end_date);

      const daysColumns = [];
      while (currentDate.isSameOrBefore(end)) {
        const monthLable = currentDate.format("MMMM");
        const day = currentDate.date();
        const _day = currentDate.day();
        console.log(currentDate.day(), 'currentDate.day()');
        daysColumns.push({
          title: `${day}-${monthLable}`,
          dataIndex: `${currentDate.year()}-${currentDate.month()}-${currentDate.date()}`,
          render: (text, record) => {
            switch (_day) {
              case 0:
                return record.sunday
                break;
              case 1:
                return record.monday
                break;
              case 2:
                return record.tuesday
                break;
              case 3:
                return record.wednesday
                break;
              case 4:
                return record.thursday
                break;
              case 5:
                return record.friday
                break;
              case 6:
                return record.saturday
                break;

              default:
                break;
            }
          }
        })

        currentDate = currentDate.add(1, 'days');
      };
      setChangedDays(daysColumns);

      const { result: workContracts } = await request.list({ entity })
      const { result: assignedEmployees } = await request.list({ entity: "assignedEmployee" })
      console.log(assignedEmployees, workContracts, 'assignedEmployee');

      const unassignedContracts = [];
      const assignedContracts = [];

      workContracts.map(obj => {
        obj.hrs_bi = obj.type === 1 ? mathCeil(obj.hr_week * 4.333 / 2) : 0;
        obj.week_pay = obj.type === 1 ? mathCeil(obj.hr_week * 4.333 / 2) : 0;
      })

      const _listItems = assignedEmployees.filter(({ contract }) =>
        contract.status === "active" &&
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
      assignedEmployees.map(obj => {
        const { contract: assignedContract } = obj;
        assignedContract.hrs_bi = assignedContract.type === 1 ? mathCeil(assignedContract.hr_week * 4.333 / 2) : 0;
        assignedContract.week_pay = assignedContract.type === 1 ? mathCeil(assignedContract.hr_week * 4.333 / 2) : 0;
        obj.sunday = obj.sunday ? getHours(obj.sunday) : 0;
        obj.monday = obj.monday ? getHours(obj.monday) : 0;
        obj.tuesday = obj.tuesday ? getHours(obj.tuesday) : 0;
        obj.wednesday = obj.wednesday ? getHours(obj.wednesday) : 0;
        obj.thursday = obj.thursday ? getHours(obj.thursday) : 0;
        obj.friday = obj.friday ? getHours(obj.friday) : 0;
        obj.saturday = obj.saturday ? getHours(obj.saturday) : 0;


        assignedContracts.push(assignedContract);
      });
      workContracts.map(contract => {
        const item = assignedContracts.filter(obj => obj._id === contract._id);
        if (!item.length) {
          unassignedContracts.push(contract)
        }
      })
      console.log(_listItems, '_listItems_listItems');

      setListItems(_listItems)
    }
    init()
  }, [
    currentPeriod
  ])

  return (

    <Layout style={{ padding: '100px', overflow: 'auto' }}>

      <Row>
        <Col span={24}>
          <h3 style={{ textAlign: 'center' }}>
            <LeftOutlined onClick={prevData} />
            QUINCENA: {currentPeriod.split("-")[0]} DE {parseInt(currentPeriod.split("-")[0]) !== 31 ? new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' }) : new Date(currentYear, currentMonth - 2).toLocaleString('default', { month: 'long' })} AL {currentPeriod.split("-")[1]} DE {new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' })} {currentYear}
            <RightOutlined onClick={nextData} />

          </h3>
        </Col>
      </Row>
      <Table

        // scroll={{ x: (changedDays.length + columns.length) * 100, y: 1300 }}
        bordered
        rowKey={(item) => item._id}
        key={(item) => item._id}
        dataSource={listItems || []}
        columns={[...columns, ...changedDays]}
        rowClassName="editable-row"
        style={{ width: '1000px' }}

      />


    </Layout>
    // <DashboardLayout>
    //   <Layout style={{ minHeight: '100vh' }}>

    //   </Layout>
    // </DashboardLayout>
  );
};
export default PayrollDetails;