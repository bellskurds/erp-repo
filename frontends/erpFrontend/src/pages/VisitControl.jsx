import { DashboardLayout, DefaultLayout } from '@/layout';
import { DashOutlined, DeleteOutlined, EditOutlined, EyeOutlined, LeftOutlined, RightOutlined, SafetyOutlined, SearchOutlined, SkinOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, InputNumber, Layout, Modal, Popconfirm, Radio, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import Search from 'antd/lib/transfer/search';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { request } from '@/request';
import moment from 'moment';
import SelectAsync from '@/components/SelectAsync';
import { useContext } from 'react';
const EditableContext = React.createContext(null);

const statusLabel = ["", "Active", "Canceled", "Finished"]
const statusArr = [
  { value: 0, label: "all" },
  { value: 1, label: "Active" },
  { value: 2, label: "Canceled" },
  { value: 3, label: "Finished" },
];
const statusArr1 = [
  { value: 1, label: "Active" },
  { value: 2, label: "Canceled" },
  { value: 3, label: "Finished" },
];
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({
        ...record,
        ...values,
      }, values);
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
const VisitControl = () => {
  const entity = "visitControl"
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState([]);

  const [isUpdate, setIsUpdate] = useState(false);
  const [rangeDate, setRangeDate] = useState();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const visitType = [
    '',

    <TeamOutlined />,
    <SkinOutlined />,
    <SafetyOutlined />,

  ]
  const showModal = () => {

    setCurrentId(new Date().valueOf())
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
  const generateCustomerId = () => {
    return new Date().valueOf();
  }
  const [customerStores, setCustomerStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [changeStatus, setChangeStatus] = useState(false);
  const [changedMonth, setChangedMonth] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [currentId, setCurrentId] = useState('');
  const [currentItem, setCurrentItem] = useState({});
  const [references, setReferences] = useState([]);
  const [initEmployeeColumns, setInitEmployeeColumns] = useState([]);
  const [paginations, setPaginations] = useState([])
  const [endDate, setEndDate] = useState();
  const [status, setStatus] = useState();
  const [summatoryCost, setSummatoryCost] = useState();
  const isEditing = (record) => record._id === editingKey;
  const editItem = (item) => {

    if (item) {

      setTimeout(() => {

        const { employees, _id, removed, enabled, created, periods, ...otherValues } = item;
        if (formRef.current) formRef.current.setFieldsValue({ ...otherValues, periods: periods ? [moment(periods[0]), moment(periods[1])] : null });
        setEmployeeList(JSON.parse(employees))

      }, 200);
      console.log(item, '33334343');
      setCurrentItem(item);

      setCurrentId(item._id);
      setIsModalVisible(true);
      setIsUpdate(true);
    }
  }
  const deleteItem = (item) => {
    const id = item._id;
    dispatch(crud.delete({ entity, id }))
    setTimeout(() => {
      dispatch(crud.resetState());
      dispatch(crud.list({ entity }));
    }, 1000)
  }
  const getDateLabel = (date) => {
    if (!date) return '';
    const start = moment(date[0]);
    const end = moment(date[1]);
    return `${start.format("MMMM")}${start.date()}(${start.year()}) - ${end.format("MMMM")}${end.date()}(${end.year()})`
  }
  const typeArr = ["", "Residential", "Commercial"]
  const columns = [
    {
      title: 'Client(Branch)',
      dataIndex: ['customer', 'name'],
      width: '15%',
      render: (text, { store }) => {
        return (`${text}(${store.store})`)
      }
    },
    {
      title: 'T',
      dataIndex: 'store_visit_value',
      width: '15%',
    },
    {
      title: 'R',
      dataIndex: 'visit_value',
      width: '15%',
    },
    {
      title: 'P',
      dataIndex: 'difference',
      width: '15%',
      render: (text, record) => {
        return (record.store_visit_value || 0 - record.visit_value || 0);
      }
    },
    {
      title: 'INSU',
      dataIndex: ['ref', 'ref'],
      width: '15%',
    },
    // {
    //   title: 'Actions',
    //   dataIndex: 'operation',
    //   width: "10%",
    //   align: 'center',
    //   render: (_, record) => {
    //     return (

    //       <>
    //         <Typography.Link onClick={() => editItem(record)}>
    //           <EditOutlined style={{ fontSize: "20px" }} />
    //         </Typography.Link>

    //         <Popconfirm title="Sure to delete?" onConfirm={() => deleteItem(record)}>
    //           <DeleteOutlined style={{ fontSize: "20px" }} />
    //         </Popconfirm>
    //       </>
    //     )

    //   },
    // },

  ];
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);
  const { pagination, items } = listResult;
  const onFinish = async (values) => {
    const { customer, visit_date, store } = values;
    const { result } = await request.listById({ entity: 'visitControl', jsonData: { customer: customer, store: store, visit_date: getDate(visit_date) } });
    values['visit_date'] = getDate(visit_date);
    if ((result && result.length) || moment().isBefore(visit_date)) {
      return message.error("can't you save on same date or future date ")
    }
    if (isUpdate && currentId) {
      const id = currentId;
      dispatch(crud.update({ entity, id, jsonData: values }));
    } else {
      // const { result } = await request.create({ entity, jsonData: values });
      dispatch(crud.create({ entity, jsonData: values }));
    }
    formRef.current.resetFields();
    setTimeout(() => {
      dispatch(crud.resetState());
      dispatch(crud.list({ entity }));
    }, [400])
    handleCancel();
    setChangeStatus(!changeStatus);
  };
  const formRef = useRef(null);
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const getObjectDiff = (obj1, obj2) => {
    const diff = [];

    // Check for changed properties and values
    for (let i = 0; i < obj1.length; i++) {
      const obj1Props = Object.keys(obj1[i]);
      const obj2Props = Object.keys(obj2[i]);
      const changedProps = [];

      for (let prop of obj1Props) {
        if (obj2[i].hasOwnProperty(prop) && obj1[i][prop] !== obj2[i][prop]) {
          changedProps.push({ [prop]: obj2[i][prop] });
        }
      }

      if (changedProps.length > 0) {
        diff.push({ index: i, changes: changedProps });
      }
    }

    // Check for added properties and values
    for (let i = 0; i < obj2.length; i++) {
      const obj2Props = Object.keys(obj2[i]);

      for (let prop of obj2Props) {
        let found = false;

        for (let j = 0; j < obj1.length; j++) {
          if (obj1[j].hasOwnProperty(prop)) {
            found = true;
            break;
          }
        }

        if (!found) {
          diff.push({ index: i, added: { [prop]: obj2[i][prop] } });
        }
      }
    }

    return diff;
  }
  const ExtraWeek = () => {
    const start_ = endDate.date();
    const end_ = start_ + 7;

    let currentDate = endDate;
    let dates = []; // Array to store the next 7 days
    for (let i = start_; i < end_; i++) {
      dates.push({ title: currentDate.format('YYYY-MM-DD'), dataIndex: `day_${currentDate.format('YYYY-MM-DD')}`, editable: true, render: (text) => { return (text || 0) } }); // Add the formatted date to the array
      currentDate = currentDate.add(1, 'day'); // Increment the current date by 1 day
    }

    setInitEmployeeColumns([...initEmployeeColumns, ...dates]);
  }

  const addEmployee = () => {
    const defaultObj = {};
    for (var i = 0; i < initEmployeeColumns.length; i++) {
      var { dataIndex } = initEmployeeColumns[i];
      if (dataIndex.includes('day_')) {
        defaultObj[dataIndex] = 0;
      }
    }
    setEmployeeList([...employeeList, { key: new Date().valueOf(), ...defaultObj }])
  }
  useEffect(() => {

    const Columns = [
      {
        title: "Employee",
        dataIndex: "employee",
        render: (_, record) => {
          return (
            <SelectAsync entity={"employee"} displayLabels={["name"]} onChange={(e) => changeEmployee(e, record)} value={_} />
          );
        }
      },
      {
        title: "Total",
        dataIndex: "total",
        render: (_, record) => {
          return (totalHours(record) || 0);
        }
      },
    ]
    let currentDate = moment(new Date());
    let dates = []; // Array to store the next 7 days
    if (employeeList && employeeList.length) {
      let totalCost = 0;
      employeeList.map(item => {
        Object.keys(item).map(key => {
          if (key.includes('day_')) {

            totalCost += parseFloat(item[key]);

            console.log(totalCost);
          }
        })
      });
      formRef.current.setFieldsValue({ cost: totalCost })

      setSummatoryCost(totalCost);



      const item = employeeList[0];
      Object.keys(item).map((key, index) => {
        if (key.includes('day_')) {
          dates.push({
            title: key.split('day_')[1],
            dataIndex: key,
            editable: true,
          })
          const end = moment(key.split('day_')[1]);
          end.add(1, 'day')
          setEndDate(end)
        }
      })
    } else {
      for (let i = 0; i < 7; i++) {
        dates.push({
          title: currentDate.format('YYYY-MM-DD'),
          dataIndex: `day_${currentDate.format('YYYY-MM-DD')}`,
          editable: true,
        }); // Add the formatted date to the array
        currentDate = currentDate.add(1, 'day'); // Increment the current date by 1 day

        setEndDate(currentDate);
      }
    }

    setInitEmployeeColumns([...Columns, ...dates]);
  }, [employeeList]);

  useEffect(() => {
    console.log(filteredStores, 'filteredStores');
  }, [filteredStores])

  useEffect(() => {
    dispatch(crud.resetState());
    dispatch(crud.list({ entity }));

    async function init() {
      const { result } = await request.listById({ entity: 'customerStores' });

      setCustomerStores(result);
      // setReferences(result);
    }
    init();
  }, []);
  useEffect(() => {
    // setFilterData(items);
    setPaginations(pagination)
  }, [items, pagination])
  const handleSave = (row, values) => {

    console.log(values, row, '33333');
    const newData = [...employeeList];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setEmployeeList(prev => {
      const newValue = [...newData];
      return newValue
    });
  };
  useEffect(() => {
    const newData = [...employeeList];
    newData.map(obj => [
      initEmployeeColumns.map(columns => {
        const { dataIndex } = columns;
        if (dataIndex.includes('day_') && !obj.hasOwnProperty(dataIndex)) {
          obj[dataIndex] = 0;
        }
      })
    ])
  }, [initEmployeeColumns])

  const totalHours = (record) => {
    var total = 0;
    for (var key in record) {
      if (key.includes('day_')) {
        total += parseFloat(record[key]);
      }
    }
    return total;
  }

  const changeEmployee = (value, record) => {

    record.employee = value;
    const updatedData = employeeList.map((item) => {
      if (item.key === record.key) {
        return record;
      }
      return item;
    });
  }
  useEffect(() => {
    const filteredData = items.filter((record) => {
      const { customer } = record;

      const recordStartDate = record.periods ? new Date(moment(record.periods[0]).format("YYYY-MM-DD")) : null;
      const recordEndDate = record.periods ? new Date(moment(record.periods[1]).format("YYYY-MM-DD")) : null;
      const startDate = rangeDate ? new Date(rangeDate[0].format("YYYY-MM-DD")) : null;
      const endDate = rangeDate ? new Date(rangeDate[1].format("YYYY-MM-DD")) : null;
      return (
        (!searchText || record['project_id'].toString().toLowerCase().includes(searchText.toLowerCase()) ||
          customer['name'].toString().toLowerCase().includes(searchText.toLowerCase())) &&
        (!rangeDate || (startDate && endDate && recordStartDate >= startDate && recordEndDate <= endDate)) &&
        (!status || record.status === status)
      );

    })
    // setFilterData(filteredData);
    setPaginations({ current: 1, pageSize: 10, total: filteredData.length })
  }, [searchText, status, rangeDate])

  const handelDataTableLoad = useCallback((pagination) => {
    const { current, total } = pagination;

    console.log(pagination, 'pagination');
    setPaginations(pagination)
    return true;
  }, [filterData, searchText]);

  const prevData = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(12)
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }
  const nextData = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(1);
    }
    else {
      setCurrentMonth(currentMonth + 1);
    }
  }
  useEffect(() => {

    async function init() {

      const startDay = 1;
      const endDay = new Date(currentYear, currentMonth, 0).getDate();
      const start_date = new Date(currentYear, currentMonth - 1, startDay);
      const end_date = new Date(currentYear, currentMonth - 1, endDay);
      let currentDate = moment(start_date);
      const end = moment(end_date);
      const daysColumns = [];
      while (currentDate.isSameOrBefore(end)) {
        const monthLable = currentDate.format("MMMM");
        const day = currentDate.format("DD")
        const year = currentDate.year();
        const month = currentDate.format("MM");
        daysColumns.push({
          title: `${day}-${monthLable}`,
          dataIndex: `day_${year}-${month}-${day}`,
        })
        currentDate = currentDate.add(1, 'days');
      };
      setChangedMonth(daysColumns)
      const { result: visitDatas } = await request.list({ entity: "visitControl" });
      console.log(currentYear, currentMonth);
      const fillteredData = visitDatas.filter(({ visit_date }) =>
      (
        new Date(visit_date).getFullYear() === currentYear
        && new Date(visit_date).getMonth() === (currentMonth - 1)
      )
      )
      const groupedData = JSON.parse(JSON.stringify(groupArry(fillteredData)));

      groupedData.map((obj, index) => {
        const { values } = obj;
        obj['key'] = index;
        obj['visit_value'] = values.length
        values.map(value => {
          console.log(getDate(value.visit_date), 'value.date');
          obj[`day_${getDate(value.visit_date)}`] = visitType[value.type];
        })
      })

      console.log(groupedData);
      setFilterData(groupedData)


    }
    init();

  }, [
    currentMonth, currentYear, changeStatus
  ])
  const dateValue = (value) => {
    return `${new Date(value).getFullYear()}-${new Date(value).getMonth()}`
  }
  const getDate = (value) => {
    return moment(value).format("YYYY-MM-DD")
  }
  const groupArry = (data) => {
    const groupedData = data.reduce((result, item) => {
      const key = `${dateValue(item.visit_date)}-${item.customer._id}-${item.store._id}`;
      if (!result[key]) {
        result[key] = { date: item.visit_date, customer: item.customer, store: item.store, values: [] };
      }
      result[key].values.push(item);
      // console.log(key, item, 'dfdf');
      return result;
    }, {});
    const groupedArray = Object.values(groupedData);

    return groupedArray;
  }



  const Footer = () => {
    const pages = paginations
    const { current, count, total, page } = pages
    const currentPage = current || page;
    const totalSize = total || count;

    return (
      <>
        Mostrando registros del {filterData.length ? ((currentPage - 1) * 10 + 1) : 0} al {currentPage * 10 > (totalSize) ? (totalSize) : currentPage * 10} de un total de {totalSize} registros
      </>
    );
  }
  const changedClient = (e) => {
    const filteredData = customerStores.filter(({ parent_id }) => parent_id._id === e);

    if (filteredData.length) {
      const storeData = [];
      filteredData.map(({ _id, store }) => {
        storeData.push({
          value: _id,
          label: store
        })
      })
      setFilteredStores(storeData);
    } else {
      formRef.current.resetFields(['store'])
      setFilteredStores([])
    }
  }
  return (

    <DashboardLayout>
      <Layout style={{ minHeight: '100vh' }}>
        <Modal title="Create Form" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null} width={500}>
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
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >

              <Row gutter={24}>

                <Col span={24}>
                  <Form.Item
                    name="customer"
                    label="Customer"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <SelectAsync
                      entity={'client'}
                      displayLabels={['name']}
                      onChange={changedClient}
                    />
                  </Form.Item>
                  <Form.Item
                    name="store"
                    label="Store"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      options={filteredStores}
                    />
                  </Form.Item>
                  <Form.Item name="visit_date" label="Date/Time" rules={[
                    {
                      required: true,
                    },
                  ]}>
                    <DatePicker />
                  </Form.Item>
                  <Form.Item
                    name='type'
                    label='Type'
                    required={[
                      {
                        required: true
                      }
                    ]}
                  >
                    <Radio.Group
                      options={[
                        {
                          value: 1,
                          label: "Visit"
                        },
                        {
                          value: 2,
                          label: "Products"
                        },
                        {
                          value: 3,
                          label: "Inspection"
                        }]}
                    />
                  </Form.Item>
                  <Form.Item
                    name="comments"
                    label="Comments"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                </Col>
              </Row>
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
          </>
        </Modal>
        <Layout >
          <Row gutter={24} style={{ textAlign: 'right' }}>
            <Col span={24}>
              <h3 style={{ textAlign: 'center' }}>
                <LeftOutlined onClick={prevData} />
                {currentMonth} {currentYear}
                <RightOutlined onClick={nextData} />
              </h3>
            </Col>
            <Col span={6}>
              <Input
                placeholder='Search'
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col span={18}>
              <Button onClick={showModal} type="primary">New Visit</Button>
            </Col>
          </Row>

          <Form form={form} component={false}>
            <Table
              style={{ overflow: 'auto' }}
              bordered
              dataSource={filterData}
              columns={[...mergedColumns, ...changedMonth]}
              rowClassName="editable-row"
              pagination={paginations}
              onChange={handelDataTableLoad}
              footer={Footer}


            />
          </Form>


        </Layout>
      </Layout>
    </DashboardLayout>
  );
};
export default VisitControl;