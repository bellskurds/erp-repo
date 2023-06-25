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


const PayrollDetails = () => {
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
  const columns = [
    {
      title: 'Period',
      dataIndex: 'personal_id',
      width: '15%',
      editable: true,
    },
    {
      title: 'Total Payroll',
      dataIndex: 'name',
      width: '15%',
      editable: true,
    },
    {
      title: 'Total for services',
      dataIndex: 'email',
      width: '15%',
      editable: true,
    },
    {
      title: 'Total',
      dataIndex: 'phone',
      width: '15%',
      editable: true,
    },
  ];

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  const { pagination, items } = listResult;

  const formRef = useRef(null);

  useEffect(() => {
    dispatch(crud.resetState())
    dispatch(crud.list({ entity }));
  }, []);


  return (

    <DashboardLayout>
      <Layout style={{ minHeight: '100vh' }}>

        <Layout>
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
              dataSource={[]}
              columns={columns}
              rowClassName="editable-row"


            />
          </Form>


        </Layout>
      </Layout>
    </DashboardLayout>
  );
};
export default PayrollDetails;