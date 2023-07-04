import { DashboardLayout, DefaultLayout } from '@/layout';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, InputNumber, Layout, Modal, Popconfirm, Radio, Row, Select, Space, Table, Tag, Typography } from 'antd';
import Search from 'antd/lib/transfer/search';
import React, { useEffect, useRef, useState } from 'react';
import CustomModal from 'modules/CustomModal'
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { request } from '@/request';
import moment from 'moment';
import SelectAsync from '@/components/SelectAsync';



const Projects = () => {
  const entity = "project"
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [components, setComponents] = useState([]);

  const [isUpdate, setIsUpdate] = useState(false);
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

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [currentId, setCurrentId] = useState('');
  const [currentItem, setCurrentItem] = useState({});
  const [references, setReferences] = useState([]);
  const [initEmployeeColumns, setInitEmployeeColumns] = useState([]);
  const [endDate, setEndDate] = useState();
  const [employeeList, setEmployeeList] = useState([]);
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
      dispatch(crud.resetState());
      dispatch(crud.list({ entity }));
    }, 1000)
  }
  const columns = [
    {
      title: 'Date',
      dataIndex: 'created',
      width: '15%',
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
    },
    {
      title: 'Employees',
      dataIndex: 'employees',
      width: '15%',
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      width: '15%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '15%',
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
            <Typography.Text>
              <Link to={`/customer/details/${record._id}`}>
                <EyeOutlined style={{ fontSize: "20px" }} />
              </Link>
            </Typography.Text>

          </>
        )

      },
    },

  ];


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
  const onSearch = (value) => console.log(value);
  const onFinish = (values) => {

    console.log(employeeList, '-----------')
    // if (isUpdate && currentId) {
    //   const id = currentId;
    //   dispatch(crud.update({ entity, id, jsonData: values }));
    // } else {
    //   dispatch(crud.create({ entity, jsonData: values }));
    // }
    // formRef.current.resetFields();
    // dispatch(crud.resetState());
    // dispatch(crud.list({ entity }));
    // handleCancel()
  };
  const formRef = useRef(null);
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const ExtraWeek = () => {
    console.log(endDate, '123123');
    const start_ = endDate.date();
    const end_ = start_ + 7;

    let currentDate = endDate;
    let dates = []; // Array to store the next 7 days
    for (let i = start_; i < end_; i++) {
      dates.push({ title: currentDate.format('YYYY-MM-DD'), render: () => { return (0) } }); // Add the formatted date to the array
      currentDate = currentDate.add(1, 'day'); // Increment the current date by 1 day
    }
    setInitEmployeeColumns([...initEmployeeColumns, ...dates])
  }
  const addEmployee = () => {
    setEmployeeList([...employeeList, { key: employeeList.length }])
  }
  useEffect(() => {

    const Columns = [
      {
        title: "Employee",
        dataIndex: "employee",
        render: () => {
          return (
            <SelectAsync entity={"employee"} displayLabels={["name"]} />
          );
        }
      },
      {
        title: "Total",
        dataIndex: "total"
      },
    ]
    let currentDate = moment(new Date());
    let dates = []; // Array to store the next 7 days
    for (let i = 0; i < 7; i++) {
      dates.push({ title: currentDate.format('YYYY-MM-DD'), render: () => { return (0) } }); // Add the formatted date to the array
      currentDate = currentDate.add(1, 'day'); // Increment the current date by 1 day

      setEndDate(currentDate);
    }
    console.log(dates, 'datesdates');
    setInitEmployeeColumns([...Columns, ...dates])
    dispatch(crud.resetState());
    dispatch(crud.list({ entity }));

    async function init() {
      const { result } = await request.list({ entity: 'reference' });
      console.log(result, '555555');
      result.map(obj => {
        obj.value = obj._id;
        obj.label = obj.ref
      })
      setReferences(result);
    }
    init();
  }, []);

  console.log(items, '33333434343')
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
                  <Form.Item name="periods" label="From ~ To">
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
                    <Select

                      placeholder="Select Reference"
                      optionFilterProp="children"
                      options={references} />
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
            <Table dataSource={employeeList || []} columns={initEmployeeColumns} style={{ overflow: "scroll" }} />
          </>
        </Modal>
        <Layout>
          <Row>
            {/* <Col span={10}>
              <Search placeholder="input search text" onSearch={onSearch} enterButton />
            </Col> */}
            <Col span={8}>
              <Input placeholder='search' />
            </Col>
            <Col span={16}>
              <DatePicker.RangePicker />
              <Select
                placeholder="Select a person"
                optionFilterProp="children"
                options={[{
                  label: 'Active',
                  value: 1
                }, {
                  label: 'Cancelled',
                  value: 2
                }, {
                  label: 'Finished',
                  value: 3
                }]} />
              <Button onClick={showModal} type="primary">Create Project</Button>
            </Col>
          </Row>

          <Form form={form} component={false}>
            <Table

              bordered
              rowKey={(item) => item._id}
              key={(item) => item._id}
              dataSource={items}
              columns={mergedColumns}
              rowClassName="editable-row"


            />
          </Form>


        </Layout>
      </Layout>
    </DashboardLayout>
  );
};
export default Projects;