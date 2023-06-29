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

const columns = [
  {
    title: 'Customer',
    dataIndex: 'personal_id',
    width: '100',
    editable: true,
  },
  {
    title: 'Employee',
    dataIndex: ['parent_id', 'name'],
    width: '100',
    editable: true,
  },
  {
    title: 'Hours',
    dataIndex: 'email',
    width: '100',
    editable: true,
  },
  {
    title: 'HR/Week',
    dataIndex: 'hr_week',
    width: '100',
    editable: true,
  },
  {
    title: 'Type',
    dataIndex: 'type',
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
    dataIndex: 'hrs_bi',
    editable: true,
  },
  {
    title: 'Week Pay',
    dataIndex: 'week_pay',
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
  // useEffect(() => {


  //   console.log(1);
  //   async function init() {
  //     const res = await request.list({ entity })
  //     const result = res.result;
  //     result.map(obj => {
  //       obj.hrs_bi = obj.type === 1 ? mathCeil(obj.hr_week * 4.333 / 2) : 0;
  //       obj.week_pay = obj.type === 1 ? mathCeil(obj.hr_week * 4.333 / 2) : 0;
  //     })
  //     setListItems(result)
  //   }
  //   init();

  // }, []);


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


  // useEffect(() => {

  //   console.log(listItems, '3333')
  //   setListItems(listItems)
  // }, [
  //   listItems
  // ])

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
        daysColumns.push({
          title: `${day}-${monthLable}`
        })

        currentDate = currentDate.add(1, 'days');
      };
      setChangedDays(daysColumns);

      const res = await request.list({ entity })
      const result = res.result;
      result.map(obj => {
        obj.hrs_bi = obj.type === 1 ? mathCeil(obj.hr_week * 4.333 / 2) : 0;
        obj.week_pay = obj.type === 1 ? mathCeil(obj.hr_week * 4.333 / 2) : 0;
      })
      const _listItems = result.filter(obj =>
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


      />


    </Layout>
    // <DashboardLayout>
    //   <Layout style={{ minHeight: '100vh' }}>

    //   </Layout>
    // </DashboardLayout>
  );
};
export default PayrollDetails;