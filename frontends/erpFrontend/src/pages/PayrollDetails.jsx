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
import { selectCurrentAdmin } from '@/redux/auth/selectors';
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



const mathCeil = (value) => {
  return value.toFixed(2)
}
const PayrollDetails = () => {
  const entity = "payroll"
  const url = useParams().id;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const tableRef = useRef(null);

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
  const [currentId, setCurrentId] = useState('');
  const [currentItem, setCurrentItem] = useState({});
  const [allHours, setAllHours] = useState([]);
  const [saveStatus, setSaveStatus] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(parseInt(url.split("-")[1]));
  const [currentYear, setCurrentYear] = useState(parseInt(url.split("-")[0]));
  const [currentQ, setCurrentQ] = useState(parseInt(url.split("-")[2]));
  const [currentBiWeek, setCurrentBiweek] = useState(new Date())
  const [currentPeriod, setCurrentPeriod] = useState('1-15')
  const [changedDays, setChangedDays] = useState([]);
  const [biWeek, setBiWeek] = useState(0);
  const [selectedCellValue, setSelectedCellValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState();
  const [byEmail, setByEmail] = useState();
  const [adjust, setAdjust] = useState(0);
  const [mergedColumns, setMergedColumns] = useState([]);
  const editItem = (item, cellItem, current, mainHour) => {
    const { hour, comment, by: { email: byEmail = '' } = {} } = cellItem
    if (item) {
      setTimeout(() => {
        if (formRef.current) formRef.current.setFieldsValue({
          hours: hour,
          comment: comment,
        });
      }, 400);
      setSelectedCellValue(mainHour)
      setSelectedDate(current);
      setByEmail(byEmail)
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
  const calcAdjustment = (record) => {
    var adjust = 0;
    for (var key in record) {
      if (key.includes('_day-')) {
        adjust += record[key];
      }
    }
    return adjust;
  }
  const columns = [
    {
      title: 'Customer',
      dataIndex: ['parent_id', 'name'],
      width: 100,
    },
    {
      title: 'Position',
      dataIndex: 'position',
      width: 150,
    },
    {
      title: 'Employee',
      dataIndex: ['employee', 'name'],
      width: 200
    },
    {
      title: `Hours`,
      width: 400,
      align: 'center',
      render: (text, record) => (
        <>
          {
            `${getFormattedHours(
              [
                record.monday ? [record.monday[0], record.monday[1]] : "",
                record.tuesday ? [record.tuesday[0], record.tuesday[1]] : "",
                record.wednesday ? [record.wednesday[0], record.wednesday[1]] : "",
                record.thursday ? [record.thursday[0], record.thursday[1]] : "",
                record.friday ? [record.friday[0], record.friday[1]] : "",
                record.saturday ? [record.saturday[0], record.saturday[1]] : "",
                record.sunday ? [record.sunday[0], record.sunday[1]] : "",
              ])}`

          }
        </>
      ),
    },
    {
      title: 'HR/Week',
      dataIndex: 'hr_week',
      width: 100,
    },
    {
      title: 'Type',
      dataIndex: ['contract', 'type'],
      width: 100,
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
    },
    {
      title: 'Hrs/BiWeekly',
      width: '100',
      dataIndex: 'hrs_bi',
    },
    {
      title: 'Week Pay',
      dataIndex: 'week_pay',
      width: '25',
    },
    {
      title: 'Adjustment',
      dataIndex: 'adjustment',
      width: '100',


    },
    {
      title: 'Adjust($$$)',
      dataIndex: 'adjust',
      width: '100',

    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      width: '100',

    },
    {
      title: 'Transferencia',
      dataIndex: 'transferencia',
      width: '100',

    },
  ];
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
    setCurrentPeriod(getPeriods(currentMonth, currentYear, currentQ))
  }, [currentMonth, currentQ, currentYear])
  const AdminId = useSelector(selectCurrentAdmin);
  const Auth = JSON.parse(localStorage.getItem('auth'));
  const onFinish = (values) => {
    const { comment, hours } = values;
    const { contract, employee, parent_id } = currentItem
    const jsonData = { by: Auth.id, hour: hours, date: selectedDate, comment: comment, contract: contract._id, employee: employee._id, customer: parent_id._id }
    console.log(allHours, 'allHoursallHours');

    const item = allHours.filter(obj => obj.contract === contract._id && obj.employee === employee._id && obj.customer === parent_id._id && obj.date === selectedDate)
    if (item.length) {
      dispatch(crud.update({ entity, id: item[0]._id, jsonData }))
    } else {
      dispatch(crud.create({ entity, jsonData }))
    }
    setIsModalVisible(false);
    setSaveStatus(!saveStatus)

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
  const changedCellItem = (hours, date, record) => {
    const { contract: { _id: contract_id }, employee: { _id: employee_id }, parent_id: { _id: customer_id } } = record;
    const item = hours.find(obj => obj.contract === contract_id && obj.employee === employee_id && obj.customer === customer_id && obj.date === date);
    if (item) {
      return item
    } else {
      return false;
    }
  }


  useEffect(() => {
    async function init() {
      const { result: allHours } = await request.list({ entity });
      setAllHours(allHours)
      console.log(allHours, '1qwqwq');
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
        const year = currentDate.year();
        const month = currentDate.month();
        daysColumns.push({
          title: `${monthLable.slice(0, 1).toUpperCase()}(${day})`,
          dataIndex: `-day-${year}_${month + 1}_${day}`,
          width: 100,
          render: (text, record) => {
            switch (_day) {
              case 0:
                return (

                  record.hasOwnProperty('type') ?
                    <Typography.Text>
                      {0}
                    </Typography.Text>
                    :
                    <Typography.Text onDoubleClick={() => editItem(record, changedCellItem(allHours, `${year}/${month + 1}/${day}`, record) || { hour: record.sunday_hr }, `${year}/${month + 1}/${day}`, record.sunday_hr)}>
                      {parseFloat(text) || 0}
                    </Typography.Text>
                );
                break;
              case 1:
                return (
                  record.hasOwnProperty('type') ?
                    <Typography.Text>
                      {0}
                    </Typography.Text>
                    :
                    <Typography.Text onDoubleClick={() => editItem(record, changedCellItem(allHours, `${year}/${month + 1}/${day}`, record) || { hour: record.monday_hr }, `${year}/${month + 1}/${day}`, record.monday_hr)}>
                      {parseFloat(text) || 0}
                    </Typography.Text>
                );
                break;
              case 2:
                return (
                  record.hasOwnProperty('type') ?
                    <Typography.Text>
                      {0}
                    </Typography.Text>
                    :
                    <Typography.Text onDoubleClick={() => editItem(record, changedCellItem(allHours, `${year}/${month + 1}/${day}`, record) || { hour: record.tuesday_hr }, `${year}/${month + 1}/${day}`, record.tuesday_hr)}>
                      {parseFloat(text) || 0}
                    </Typography.Text>
                );
                break;
              case 3:
                return (
                  record.hasOwnProperty('type') ?
                    <Typography.Text>
                      {0}
                    </Typography.Text>
                    :
                    <Typography.Text onDoubleClick={() => editItem(record, changedCellItem(allHours, `${year}/${month + 1}/${day}`, record) || { hour: record.wednesday_hr }, `${year}/${month + 1}/${day}`, record.wednesday_hr)}>
                      {parseFloat(text) || 0}
                    </Typography.Text>
                );
                break;
              case 4:
                return (
                  record.hasOwnProperty('type') ?
                    <Typography.Text>
                      {0}
                    </Typography.Text>
                    :
                    <Typography.Text onDoubleClick={() => editItem(record, changedCellItem(allHours, `${year}/${month + 1}/${day}`, record) || { hour: record.thursday_hr }, `${year}/${month + 1}/${day}`, record.thursday_hr)}>
                      {parseFloat(text) || 0}
                    </Typography.Text>
                );
                break;
              case 5:
                return (
                  record.hasOwnProperty('type') ?
                    <Typography.Text>
                      {0}
                    </Typography.Text>
                    :
                    <Typography.Text onDoubleClick={() => editItem(record, changedCellItem(allHours, `${year}/${month + 1}/${day}`, record) || { hour: record.friday_hr }, `${year}/${month + 1}/${day}`, record.friday_hr)}>
                      {parseFloat(text) || 0}
                    </Typography.Text>
                );
                break;
              case 6:
                return (
                  record.hasOwnProperty('type') ?
                    <Typography.Text>
                      {0}
                    </Typography.Text>
                    :
                    <Typography.Text onDoubleClick={() => editItem(record, changedCellItem(allHours, `${year}/${month + 1}/${day}`, record) || { hour: record.saturday_hr }, `${year}/${month + 1}/${day}`, record.saturday_hr)}>
                      {parseFloat(text) || 0}
                    </Typography.Text>
                );
                break;

              default:
                break;
            }
          }
        })

        currentDate = currentDate.add(1, 'days');
      };
      console.log(daysColumns);
      setChangedDays(daysColumns);
      setMergedColumns([...columns, ...daysColumns])
      console.log();
      const { result: workContracts } = await request.list({ entity: "workContract" })
      const { result: assignedEmployees } = await request.list({ entity: "assignedEmployee" })
      const unassignedContracts = [];
      const assignedContracts = [];

      workContracts.map(obj => {
        obj.hrs_bi = obj.type === 1 ? mathCeil(obj.hr_week * 4.333 / 2) : 0;
        obj.week_pay = obj.type === 1 ? mathCeil(obj.hr_week * 4.333 / 2) : 0;
      })


      const _listItems = assignedEmployees.filter(({ contract }) =>
        Object(contract).hasOwnProperty('status') && contract.status === "active" &&
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
          const monthLable = currentDate.format("MMMM");
          const day = currentDate.date();
          const _day = currentDate.day();
          const year = currentDate.year();
          const month = currentDate.month();
          const dataIndex = `-day-${year}_${month + 1}_${day}`;
          const dataIndex1 = `_day-${year}_${month + 1}_${day}`;
          switch (_day) {
            case 0:
              obj[dataIndex] = changedCellValue(allHours, `${year}/${month + 1}/${day}`, obj) || obj.sunday_hr;
              obj[dataIndex1] = (changedCellValue(allHours, `${year}/${month + 1}/${day}`, obj) || obj.sunday_hr) - obj.sunday_hr
              break;

            case 1:
              obj[dataIndex] = changedCellValue(allHours, `${year}/${month + 1}/${day}`, obj) || obj.monday_hr;
              obj[dataIndex1] = (changedCellValue(allHours, `${year}/${month + 1}/${day}`, obj) || obj.monday_hr) - obj.monday_hr

              break;

            case 2:
              obj[dataIndex] = changedCellValue(allHours, `${year}/${month + 1}/${day}`, obj) || obj.tuesday_hr;

              obj[dataIndex1] = (changedCellValue(allHours, `${year}/${month + 1}/${day}`, obj) || obj.tuesday_hr) - obj.tuesday_hr

              break;

            case 3:
              obj[dataIndex] = changedCellValue(allHours, `${year}/${month + 1}/${day}`, obj) || obj.wednesday_hr;
              obj[dataIndex1] = (changedCellValue(allHours, `${year}/${month + 1}/${day}`, obj) || obj.wednesday_hr) - obj.wednesday_hr

              break;

            case 4:
              obj[dataIndex] = changedCellValue(allHours, `${year}/${month + 1}/${day}`, obj) || obj.thursday_hr;
              obj[dataIndex1] = (changedCellValue(allHours, `${year}/${month + 1}/${day}`, obj) || obj.thursday_hr) - obj.thursday_hr

              break;
            case 5:
              obj[dataIndex] = changedCellValue(allHours, `${year}/${month + 1}/${day}`, obj) || obj.friday_hr;
              obj[dataIndex1] = (changedCellValue(allHours, `${year}/${month + 1}/${day}`, obj) || obj.friday_hr) - obj.friday_hr


              break;
            case 6:
              obj[dataIndex] = changedCellValue(allHours, `${year}/${month + 1}/${day}`, obj) || obj.saturday_hr;
              obj[dataIndex1] = (changedCellValue(allHours, `${year}/${month + 1}/${day}`, obj) || obj.saturday_hr) - obj.saturday_hr

              break;

            default:
              break;
          }
          currentDate = currentDate.add(1, 'days');
        };
        obj.hrs_bi = assignedContract.type === 1 ? mathCeil(obj.hr_week * 4.333 / 2) : getServiceHours(obj);
        obj.week_pay = mathCeil(obj.hrs_bi * obj.sal_hr)
        obj.adjustment = calcAdjustment(obj);
        obj.adjust = (calcAdjustment(obj) * obj.sal_hr).toFixed(2);
        obj.salary = ((parseFloat(obj.adjust) + parseFloat(obj.week_pay))).toFixed(2) || 0;
        obj.transferencia = assignedContract.type === 1 ? obj.salary : (obj.salary * 0.89).toFixed(2);


      });
      assignedEmployees.map(obj => {
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
      filteredWorkContracts.map(contract => {
        const item = assignedContracts.filter(obj => (Object(obj).hasOwnProperty('_id') && obj._id === contract._id));
        if (!item.length) {
          contract.employee = contract.parent_id
          delete contract.parent_id
          contract.contract = { type: contract.type };
          contract.adjustment = 0;
          contract.adjust = 0;
          contract.salary = contract.week_pay;
          contract.transferencia = contract.type === 1 ? contract.salary : contract.salary * 0.89
          unassignedContracts.push(contract)
        }
      })
      const unAssingedEmployees = [];
      assignedEmployees.map(({ contract, employee, ...otherObject }) => {
        if (!contract || !employee)
          unAssingedEmployees.push(otherObject);
      });
      const allDatas = [..._listItems, ...unassignedContracts, ...unAssingedEmployees];
      console.log(allDatas, 'allDatas')
      allDatas.map(data => {
        if (!data.position) data.position = ''
      })
      const sortedLists = allDatas.sort((a, b) => b.position.localeCompare(a.position));
      setListItems([...sortedLists])


    }
    init()
  }, [
    currentPeriod, saveStatus, currentMonth, currentYear
  ]);
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
    console.log(listItems, 'listItems')
  }, [listItems]);

  useEffect(() => {
    console.log(mergedColumns, 'mergedColumnsmergedColumns')

  }, [mergedColumns])

  return (

    <Layout style={{ padding: '30px', overflow: 'auto' }}>
      <Modal title={selectedDate} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <>
          <Form
            ref={formRef}
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name="hours"
              label="Hours"
              rules={[
                {
                  required: true,
                  validator: (_, value) => {
                    if (selectedCellValue === 0) {
                      if (value && value > 10) {
                        return Promise.reject(`Value must be less than or equal to 10`);
                      }
                    } else {
                      if (value && value > Math.abs(selectedCellValue)) {
                        return Promise.reject(`Value must be less than or equal to ${Math.abs(selectedCellValue)}`);
                      }
                    }
                    return Promise.resolve();
                  }

                },
              ]}
            >
              <Input type='number' />
            </Form.Item>
            <Form.Item
              name="comment"
              label="Comment"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              {
                isUpdate ? <Button type="primary" htmlType="submit">
                  Update
                </Button> :
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>

              }

              <Button type="ghost" onClick={handleCancel}>
                cancel
              </Button>
            </Form.Item>
          </Form>
          {byEmail && `Changed by ${byEmail}`}
        </>
      </Modal>
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
        bordered
        rowKey={(item) => item._id}
        key={(item) => item._id}
        dataSource={[...listItems] || []}
        columns={[...mergedColumns]}
        rowClassName="editable-row"
        ref={tableRef}
        size='large'
        className='payroll_details'
        scroll={{
          x: 3300,
        }}
      />
    </Layout>
  );
};
export default PayrollDetails;