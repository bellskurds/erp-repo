import { DashboardLayout, DefaultLayout } from '@/layout';
import { DeleteOutlined, EditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Layout, Modal, Popconfirm, Row, Space, Table, Tag, Typography, message } from 'antd';
import Search from 'antd/lib/transfer/search';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CustomModal from 'modules/CustomModal'
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { request } from '@/request';
import { selectSearchedItems } from '@/redux/crud/selectors';




const Customers = () => {
  const entity = "client"
  const searchFields = 'name,email';
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isUpdate, setIsUpdate] = useState(false);
  const [searchText, setSearchText] = useState('');

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
  const handelDataTableLoad = useCallback((pagination) => {

    if (!searchText) {
      const options = { page: pagination.current || 1 };
      dispatch(crud.list({ entity, options }));
    } else {

      async function fetchData() {
        const options = {
          q: searchText,
          fields: searchFields,
          page: pagination.current || 1
        };
        const { result, paginations } = await request.search({ entity, options })
        console.log(result, paginations, 'result, paginations');
        setFilterData(result)
        setPaginations(paginations)
      }
      fetchData();
    }

  }, [searchText]);

  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [currentId, setCurrentId] = useState('');
  const [currentItem, setCurrentItem] = useState({});
  const [filterData, setFilterData] = useState([]);

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

  const deleteItem = async (item) => {
    const { result } = await request.listById({ entity: 'recurrentInvoice', jsonData: { parent_id: item._id } })
    if (!result.length) {
      const id = item._id;
      dispatch(crud.delete({ entity, id }))
      setTimeout(() => {
        dispatch(crud.resetState());
        dispatch(crud.list({ entity }));
      }, 1000)
    } else {
      message.error("can't remove with invoices")
    }
  }
  const columns = [
    {
      title: 'Customer Id',
      dataIndex: 'customer_id',
      width: '15%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '15%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '15%',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
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
  const [paginations, setPaginations] = useState(pagination)


  const onFinish = (values) => {
    if (isUpdate && currentId) {
      const id = currentId;
      dispatch(crud.update({ entity, id, jsonData: values }));
    } else {
      dispatch(crud.create({ entity, jsonData: values }));
    }
    formRef.current.resetFields();
    dispatch(crud.resetState());
    dispatch(crud.list({ entity }));
    handleCancel()
  };
  const formRef = useRef(null);
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  useEffect(() => {
    dispatch(crud.resetState());
    dispatch(crud.list({ entity }));
  }, []);
  useEffect(() => {
    setFilterData(items)
  }, [items])
  useEffect(() => {
    async function fetchData() {

      if (!searchText) {
        // setFilterData(pagination)
        setFilterData(items)
      } else {
        const options = {
          q: searchText,
          fields: searchFields,
        };
        const entity = 'client'
        const { result, paginations } = await request.search({ entity, options })
        setFilterData(result)
        setPaginations(paginations)
      }

    }
    fetchData();



  }, [searchText])

  const Footer = () => {
    const pages = searchText ? paginations : pagination
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
        <Modal title="Create Form" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
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
              <Form.Item
                name="customer_id"
                label="Customer ID"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input value={customerId} />
              </Form.Item>
              <Form.Item
                name="name"
                label="name"
                rules={[
                  {
                    required: true,
                    message: 'Please input your name!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  {
                    required: true,
                    message: 'Please input your phone!',
                  },
                ]}
              >
                <Input type='number' />
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
          </>
        </Modal>
        <Layout>
          <Row gutter={24} style={{ textAlign: 'right' }}>
            <Col span={6}>
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col span={18}>
              <Button onClick={showModal} type="primary">Create Customer</Button>
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
              pagination={searchText ? paginations : pagination}
              onChange={handelDataTableLoad}
              footer={Footer}
            />
          </Form>


        </Layout>
      </Layout>
    </DashboardLayout>
  );
};
export default Customers;