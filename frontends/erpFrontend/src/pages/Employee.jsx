import { DashboardLayout, DefaultLayout } from '@/layout';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Layout, Modal, Popconfirm, Row, Space, Table, Tag, Typography } from 'antd';
import Search from 'antd/lib/transfer/search';
import React, { useEffect, useRef, useState } from 'react';
import CustomModal from 'modules/CustomModal'
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import { Link } from 'react-router-dom/cjs/react-router-dom';
const originData = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};


const Employees = () => {
  const entity = "employee"
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
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const [currentId, setCurrentId] = useState('');
  const [currentItem, setCurrentItem] = useState({});
  const isEditing = (record) => record._id === editingKey;
  const editItem = (item) => {
    if (item) {

      if (formRef.current) formRef.current.setFieldsValue(item);
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
  const columns = [
    {
      title: 'Personal Id',
      dataIndex: 'personal_id',
      width: '15%',
      editable: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '15%',
      editable: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '15%',
      editable: true,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      width: '15%',
      editable: true,
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
              <a><DeleteOutlined style={{ fontSize: "20px" }} /></a>
            </Popconfirm>
            <Typography.Link>

              <Link to={"employee/details/" + record._id}><EyeOutlined style={{ fontSize: "20px" }} /></Link>
            </Typography.Link>

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
    if (isUpdate && currentId) {
      const id = currentId;
      dispatch(crud.update({ entity, id, jsonData: values }));
    } else {
      dispatch(crud.create({ entity, jsonData: values }));
    }
    formRef.current.resetFields();
    dispatch(crud.list({ entity }));
    handleCancel()
  };
  const formRef = useRef(null);
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  useEffect(() => {
    dispatch(crud.list({ entity }));
  }, []);


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
                name="personal_id"
                label="Personal ID"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
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
          <Row>
            <Col span={10}>
              <Search placeholder="input search text" onSearch={onSearch} enterButton />
            </Col>
            <Col>
              <Button onClick={showModal} type="primary">Create Employee</Button>
            </Col>

          </Row>

          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
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
export default Employees;