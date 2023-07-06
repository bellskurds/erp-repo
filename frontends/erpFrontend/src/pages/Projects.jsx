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
      });
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
  const isEditing = (record) => record._id === editingKey;
  const editItem = (item) => {
    if (item) {
      setTimeout(() => {

        const { employees, _id, removed, enabled, created, periods, ...otherValues } = item;
        if (formRef.current) formRef.current.setFieldsValue({ ...otherValues, periods: periods ? [moment(periods[0]), moment(periods[1])] : null });
        setEmployeeList(JSON.parse(employees))

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
      title: 'Date',
      dataIndex: 'periods',
      width: '15%',
      render: (text) => {
        return (getDateLabel(text))
      }
    },
    {
      title: 'Project Id',
      dataIndex: 'project_id',
      width: '15%',
    },
    {
      title: 'Customer',
      dataIndex: ['customer', 'name'],
      width: '15%',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: '15%',
      render: (text) => {
        return (typeArr[text]);
      }
    },
    {
      title: 'Reference',
      dataIndex: ['ref', 'ref'],
      width: '15%',
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
      title: 'Cost',
      dataIndex: 'cost',
      width: '15%',
      render: (text) => {
        return (
          `$${text}`
        );
      }
    },
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
    setFilterData(items);
    setPaginations(pagination)
  }, [items, pagination])
  const handleSave = (row) => {
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
    setFilterData(filteredData);
    setPaginations({ current: 1, pageSize: 10, total: filteredData.length })
  }, [searchText, status, rangeDate])

  const handelDataTableLoad = useCallback((pagination) => {
    const { current, total } = pagination;
    setPaginations(pagination)
    return true;
  }, [filterData, searchText]);
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
  return (

    <DashboardLayout>
      <Layout style={{ minHeight: '100vh' }}>
        <Modal title="Create Form" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null} width={1000}>
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
                    <DatePicker.RangePicker />
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
                    <Input type='number' />
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
                    name="type"
                    label="Type"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Radio.Group options={[{
                      label: "Residential",
                      value: 1
                    }, {
                      label: "Commercial",
                      value: 2
                    }]} />
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
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input type='number' />
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
            <Button onClick={addEmployee}>Add Employee</Button>
            <Button onClick={ExtraWeek}>Extra Week</Button>
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
          </>
        </Modal>
        <Layout>
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
    </DashboardLayout>
  );
};
export default Projects;