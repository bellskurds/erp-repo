import { DashboardLayout, DefaultLayout } from '@/layout';
import { DeleteOutlined, EditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, InputNumber, Layout, Modal, Popconfirm, Radio, Row, Select, Space, Table, Tag, Typography } from 'antd';
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

const statusLabel = ["", "Pending", "Progress", "Completed"]
const statusArr = [
  { value: 0, label: "all" },
  { value: 1, label: "Pending" },
  { value: 2, label: "Progress" },
  { value: 3, label: "Completed" },
];
const statusArr1 = [
  { value: 1, label: "Pending" },
  { value: 2, label: "Progress" },
  { value: 3, label: "Completed" },
];
const searchFields = "project_id"
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
  handleSave_,
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
      if (handleSave_) {
        handleSave_({
          ...record,
          ...values,
        }, values);
      } else {
        handleSave({
          ...record,
          ...values,
        }, values);
      }


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
const Projects = () => {
  const entity = "project"
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState([]);

  const [isUpdate, setIsUpdate] = useState(false);
  const [rangeDate, setRangeDate] = useState();
  const [billingCost, setBillingCost] = useState();
  const showModal = () => {

    setCurrentId(new Date().valueOf())
    setIsModalVisible(true);
    setIsUpdate(false);
    setEmployeeList([])
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
  const [customerId, setCustomerId] = useState(generateCustomerId());

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
  const [periodsDate, setPeriodsDate] = useState();
  const [currentPeriods, setCurrentPeriods] = useState();
  const [allBilling, setAllBilling] = useState(0);
  const [allECost, setAllECost] = useState(0);
  const [allOCost, setAllOCost] = useState(0);
  const [allProfitability, setAllProfitability] = useState(0);
  const isEditing = (record) => record._id === editingKey;
  const editItem = (item) => {

    if (item) {

      setTimeout(() => {

        const { employees, costs, _id, removed, enabled, created, periods, ...otherValues } = item;
        if (formRef.current) formRef.current.setFieldsValue({ ...otherValues, periods: periods ? [moment(periods[0]), moment(periods[1])] : null });
        setEmployeeList(JSON.parse(employees || "[]"))
        setCostList(JSON.parse(costs || "[]"))

      }, 200);
      console.log(item, '33334343');
      setCurrentItem(item);
      setPeriodsDate(item.periods);
      setBillingCost(item.billing)
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
      title: 'Customer',
      dataIndex: ['customer', 'name'],
      width: '15%',
    },
    {
      title: 'Reference',
      dataIndex: ['ref', 'ref'],
      width: '15%',
    },
    {
      title: "Billing ID"
    },
    {
      title: 'Date',
      dataIndex: 'periods',
      width: '15%',
      render: (text) => {
        return (getDateLabel(text))
      }
    },
    {
      title: 'Employees',
      dataIndex: 'employees',
      width: '15%',
      render: (text) => {
        return (
          text ? JSON.parse(text).length : 0
        );
      }
    },
    {
      title: 'Billing',
      dataIndex: 'billing',
      width: '15%',
      render: (text) => {
        return (
          `$${text}`
        );
      }
    },

    {
      title: 'E.Costs',
      dataIndex: 'e_cost',
      width: '15%',
      render: (text) => {
        return (
          `$${text || 0}`
        );
      }
    },
    {
      title: 'O.Costs',
      dataIndex: 'o_cost',
      width: '15%',
      render: (text) => {
        return (
          `$${text || 0}`
        );
      }
    },
    {
      title: 'Profitability',
      dataIndex: 'profitability',
      width: '15%',
      render: (text) => {
        return (
          `$${text || 0}`
        );
      }
    },
    // {
    //   title: 'Project Id',
    //   dataIndex: 'project_id',
    //   width: '15%',
    // },
    // {
    //   title: 'Invoice ID',
    //   dataIndex: 'invoice_id',
    //   width: '15%',
    // },

    // {
    //   title: 'Cost',
    //   dataIndex: 'cost',
    //   width: '15%',
    //   render: (text) => {
    //     return (
    //       `$${text}`
    //     );
    //   }
    // },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '15%',
      render: (text) => {
        return (statusLabel[text]);
      }
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      width: "10%",
      align: 'center',
      render: (_, record) => {
        return (

          <>
            <Typography.Link onClick={() => editItem(record)}>
              <EditOutlined style={{ fontSize: "20px" }} />
            </Typography.Link>

            <Popconfirm title="Sure to delete?" onConfirm={() => deleteItem(record)}>
              <DeleteOutlined style={{ fontSize: "20px" }} />
            </Popconfirm>
          </>
        )

      },
    },

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

    values['employees'] = JSON.stringify(employeeList);
    values['costs'] = JSON.stringify(costList);
    // const obj1 = JSON.parse(currentItem.employees);
    // const obj2 = employeeList;
    // const result = getObjectDiff(obj1, obj2);
    // console.log(result, '2222222222');
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
    handleCancel()
  };
  const formRef = useRef(null);
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

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

  useEffect(() => {
    if (periodsDate) {
      const start = moment(periodsDate[0]);
      const end = periodsDate[1];
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
      if (start && end) {

        setCurrentPeriods(periodsDate);
        // setEmployeeList([])
        const _columns = [];
        while (start.isSameOrBefore(end)) {
          _columns.push({
            title: start.format("MMMM/DD"),
            dataIndex: `day_${start.format("YYYY-MM-DD")}`,
            editable: true
          })
          start.add(1, 'day')
        }

        setInitEmployeeColumns([...Columns, ..._columns])
        console.log(_columns, '_columns');
      }
    } else {
      return true
    }
  }, [
    periodsDate
  ])
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
    dispatch(crud.resetState());
    dispatch(crud.list({ entity }));

    async function init() {
      const { result } = await request.list({ entity: 'reference' });
      result.map(obj => {
        obj.value = obj._id;
        obj.label = obj.ref
      })
      setReferences(result);
    }
    init();
  }, []);
  useEffect(() => {

    items.map(item => {
      const { costs, cost } = item;
      const o_cost = JSON.parse(costs || "[]").reduce((total, _item) => total + parseFloat(_item.cost), 0)
      item["o_cost"] = o_cost || 0
      item["e_cost"] = cost - (o_cost || 0)
    })
    setFilterData(items);
    setPaginations(pagination)
  }, [items, pagination])
  const handleSave = (row, values) => {

    console.log(values, row, '33333');
    row["total"] = totalHours(row);
    const newData = [...employeeList];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setEmployeeList(newData);
  };
  const handleSave_ = (row, values) => {

    console.log(values, row, '33333');
    row["total"] = totalHours(row);
    const newData = [...costList];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setCostList(newData);
  };
  useEffect(() => {

    console.log(initEmployeeColumns, employeeList, 'initEmployeeColumns');
    const newData = [...employeeList];
    newData.map(obj => [
      initEmployeeColumns.map(columns => {
        const { dataIndex } = columns;
        if (dataIndex.includes('day_') && !obj.hasOwnProperty(dataIndex)) {
          obj[dataIndex] = 0;
        }
      })
    ])
    setEmployeeList(newData)
  }, [initEmployeeColumns])

  const totalHours = (record) => {

    const _periods = formRef.current.getFieldValue("periods")

    if (_periods) {
      const start = moment(_periods[0]);
      const end = moment(_periods[1]);
      var total = 0;
      while (start.isSameOrBefore(end)) {
        total += parseFloat(record[`day_${start.format("YYYY-MM-DD")}`] || 0);
        start.add(1, 'day')
      }
      console.log(total, 'totaltotal');
      // for (var key in record) {
      //   if (key.includes('day_')) {
      //     total += parseFloat(record[key]);
      //   }
      // }
      return total;
    }
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
    setFilterData(filteredData);
    setPaginations({ current: 1, pageSize: 10, total: filteredData.length })
  }, [searchText, status, rangeDate])

  const handelDataTableLoad = useCallback((pagination) => {
    const { current, total } = pagination;
    setPaginations(pagination)
    return true;
  }, [filterData, searchText]);


  useEffect(() => {
    console.log(filterData, 'filterData');

  }, [filterData])
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
  const addCost = () => {
    setCostList([...costList, { cost: 0, comment: "..", key: new Date().valueOf() }])
  }
  const costColumn = [
    {
      title: "Cost",
      dataIndex: "cost",
      editable: true,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      editable: true,
    }
  ]
  const [costList, setCostList] = useState([]);
  useEffect(() => {

    let totalCost = 0;
    employeeList.map(item => {
      totalCost += parseFloat(item.total) || 0
    })

    costList.map(obj => {
      totalCost += parseFloat(obj.cost) || 0
    })
    setSummatoryCost(totalCost)
    if (formRef.current) formRef.current.setFieldsValue({ cost: totalCost })
  }, [
    employeeList, costList
  ])

  useEffect(() => {

    if (formRef.current) formRef.current.setFieldsValue({ profitability: (billingCost - summatoryCost) })
  }, [
    summatoryCost, billingCost
  ])
  return (

    <DashboardLayout>
      <Layout style={{ minHeight: '100vh' }}>
        <Modal title="Create Form" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null} width={1500}>
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

                <Col span={12}>
                  <Form.Item
                    name="customer"
                    label="Customer"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <SelectAsync entity={'client'} displayLabels={['name']} />
                  </Form.Item>
                  <Form.Item name="periods" label="From ~ To" rules={[
                    {
                      required: true,
                    },
                  ]}>
                    <DatePicker.RangePicker onCalendarChange={(e) => setPeriodsDate(e)} />
                  </Form.Item>
                  <Form.Item
                    name="billing"
                    label="Billing"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input type='number' onChange={(e) => setBillingCost(e)} />
                  </Form.Item>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select options={statusArr1} />
                  </Form.Item>


                </Col>
                <Col span={12}>
                  <Form.Item
                    name="invoice_id"
                    label="Invoice ID"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="ref"
                    label="Reference"
                    rules={[

                      {
                        required: true,
                      },
                    ]}
                  >
                    <SelectAsync entity={'reference'} displayLabels={['ref']} />

                    {/* <Select

                      placeholder="Select Reference"
                      optionFilterProp="children"
                      options={references} /> */}
                  </Form.Item>
                  <Form.Item
                    name="cost"
                    label="Cost"
                  // rules={[
                  //   {
                  //     required: true,
                  //   },
                  // ]}
                  >
                    <Input type='number' readOnly style={{ background: 'lightgrey' }} value={summatoryCost} />
                  </Form.Item>
                  <Form.Item
                    name="profitability"
                    label="Profitability"
                  // rules={[
                  //   {
                  //     required: true,
                  //   },
                  // ]}
                  >
                    <Input type='number' readOnly style={{ background: 'lightgrey' }} value={summatoryCost} />
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

              <hr />
            </Form>
            <Row gutter={24}>

              <Col span={16}>
                <Button onClick={addEmployee}>Add Employee</Button>
                <Table
                  dataSource={employeeList || []}
                  columns={initEmployeeColumns.map((col) => {
                    if (!col.editable) {
                      return col;
                    }
                    return {
                      ...col,
                      onCell: (record) => ({
                        record,
                        editable: col.editable,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        handleSave,

                      }),
                    };
                  })}
                  style={{ overflow: "scroll" }}
                  components={components}

                />
              </Col>
              <Col span={8}>
                <Button onClick={addCost}>Add Cost</Button>
                <Table
                  dataSource={costList || []}
                  columns={costColumn.map((col) => {
                    if (!col.editable) {
                      return col;
                    }
                    return {
                      ...col,
                      onCell: (record) => ({
                        record,
                        editable: col.editable,
                        dataIndex: col.dataIndex,
                        title: col.title,
                        handleSave_,

                      }),
                    };
                  })}
                  style={{ overflow: "scroll" }}
                  components={components}

                />
              </Col>


            </Row>
          </>
        </Modal>
        <Layout>
          <Row gutter={24} style={{ textAlign: 'right' }}>
            <Col span={8}></Col>
            <Col span={4}>
              <h3 >Billing:{allBilling}</h3>
            </Col>
            <Col span={4}>

              <h3>E.Costs:{allECost}</h3>
            </Col>
            <Col span={4}>

              <h3>O.Costs:{allOCost}</h3>
            </Col>
            <Col span={4}>

              <h3>Profitability:{allProfitability}</h3>
            </Col>
          </Row>
          <Row gutter={24} style={{ textAlign: 'right' }}>
            <Col span={6}>
              <Input
                placeholder='Search'
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col span={6}>
              <DatePicker.RangePicker value={rangeDate} onChange={(e) => { setRangeDate(e) }} />
            </Col>
            <Col span={12}>
              <Select
                placeholder="Status Filter"
                optionFilterProp="children"
                onChange={(e) => { setStatus(e) }}
                options={statusArr} />
              <Button onClick={showModal} type="primary">Create Project</Button>
            </Col>
          </Row>

          <Form form={form} component={false}>
            <Table

              bordered
              rowKey={(item) => item._id}
              key={(item) => item._id}
              dataSource={filterData}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={paginations}
              onChange={handelDataTableLoad}
              footer={Footer}


            />
          </Form>


        </Layout>
      </Layout>
    </DashboardLayout >
  );
};
export default Projects;