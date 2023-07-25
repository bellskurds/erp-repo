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
import { useEffectOnce } from 'react-use';
const contractTypes = [
  "", "Payroll", "Services", "Viaticum", "Hourly"
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
const RecurrentPaymentReport = () => {
  const entity = "payroll"
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
  const getCurrentQ = (date) => {
    if (date > 15) {
      return 1;
    } else {
      return 0;
    }
  }

  const [form] = Form.useForm();
  const [currentId, setCurrentId] = useState('');
  const [currentItem, setCurrentItem] = useState({});
  const [allHours, setAllHours] = useState([]);
  const [saveStatus, setSaveStatus] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentQ, setCurrentQ] = useState(getCurrentQ(new Date().getDate()))
  const [currentBiWeek, setCurrentBiweek] = useState(new Date())
  const [currentPeriod, setCurrentPeriod] = useState('1-15')
  const [changedDays, setChangedDays] = useState([]);
  const [biWeek, setBiWeek] = useState(0);
  const [selectedCellValue, setSelectedCellValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState();
  const [byEmail, setByEmail] = useState();
  const [adjust, setAdjust] = useState(0);
  const [totalProjection, setTotalProjection] = useState(0);
  const [totalDifference, setTotalDifference] = useState(0);
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
      title: "Payroll Contro",
      children: [
        {
          title: "Order",
          dataIndex: "key"
        },
        {
          title: "Period",
          dataIndex: "period",
          render: () => {
            return moment(new Date(currentYear, currentMonth - 1, 1)).format("MMMM YYYY")
          }
        },
        {
          title: "Quincena",
          dataIndex: "quincena",
          render: () => {
            const current = moment(new Date(currentYear, currentMonth - 1, 1));
            const Q = Math.round(currentQ + 1);
            return `${current.format("MMMM")} Q${Q} ${current.format("YYYY")}`
          }
        },

        {
          title: 'ID',
          dataIndex: ['employee', 'personal_id'],
          width: '100',
          align: "center"
        },
        {
          title: 'Employee ',
          dataIndex: ['employee', 'name'],
          width: '100',
          align: "center",
        },
        {
          title: 'Ruta',
          dataIndex: ['bank', 'ruta'],
          width: '100',
          align: "center",
        },
        {
          title: 'CTA de Banco',
          dataIndex: ['bank', 'name'],
          width: '100',
          align: "center",
        },
        {
          title: 'Tipo de cuenta',
          dataIndex: ['bank', 'account_type'],
          width: '100',
          align: "center",
        },
        {
          title: 'Categoría',
          width: '100',
          dataIndex: 'category'
        },
        {
          title: 'Type',
          width: '100',
          dataIndex: ['contract', 'type'],
          render: (type) => {
            return type ? contractTypes[type] : ''
          }
        },
        {
          title: "Gross Salary",
          dataIndex: "gross_salary"
        },
        {
          title: "Deductions",
          dataIndex: "deductions"
        },
        {
          title: "Net salary",
          dataIndex: "net_salary",
        },
        {
          title: "Transfer",
          dataIndex: "Transfer",
          render: (_, record) => {
            const { net_salary, deductions } = record;

            return (net_salary - deductions).toFixed(2)
          }
        }
      ]
    }


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
          title: `${day}-${monthLable}`,
          dataIndex: `-day-${year}_${month + 1}_${day}`,
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
      console.log();
      const { result: workContracts } = await request.list({ entity: "workContract" })
      const { result: assignedEmployees } = await request.list({ entity: "assignedEmployee" });
      const { result: bankDetails } = await request.list({ entity: "bankAccount" });
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
      _listItems.map(obj => {
        const { contract: assignedContract } = obj;
        obj.position = obj.position;
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
        obj.adjust = calcAdjustment(obj) * obj.sal_hr;
        obj.salary = parseFloat(obj.adjust) + parseFloat(obj.week_pay);
        obj.transferencia = assignedContract.type === 1 ? obj.salary : obj.salary * 0.89;
        obj.deductions = (obj.gross_salary - obj.transferencia).toFixed(2);
        obj.gross_salary = (obj.gross_salary || 0).toFixed(2);
        obj.net_salary = assignedContract.type === 1 ? (obj.gross_salary * 0.89).toFixed(2) : obj.gross_salary;
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

      const allDatas = [..._listItems];
      allDatas.map((data, index) => {
        const { employee } = data;
        data['key'] = index + 1;
        data['category'] = 'Contract'
        if (!data.position) data.position = ''
        bankDetails.map(bank => {
          if (employee._id === bank.parent_id) {
            data.bank = bank;
          }
        })
      })
      setListItems([...allDatas])
      console.log(allDatas, 'sortedLists');

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
  }, [biWeek]);


  return (

    <Layout style={{ padding: '100px', overflow: 'auto' }}>
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

        // scroll={{ x: (changedDays.length + columns.length) * 100, y: 1300 }}
        bordered
        dataSource={listItems || []}
        columns={[...columns]}
        rowClassName="editable-row"
        style={{ width: '1500px' }}
      />


    </Layout>
    // <DashboardLayout>
    //   <Layout style={{ minHeight: '100vh' }}>

    //   </Layout>
    // </DashboardLayout>
  );
};
export default RecurrentPaymentReport;