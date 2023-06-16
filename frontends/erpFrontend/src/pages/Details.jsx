import React, { useRef, useState } from 'react';
import { Form, Input, Row, Col, Tabs, Upload, Avatar, Button, message, Select } from 'antd';

import { Tag } from 'antd';

import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

import { DashboardLayout } from '@/layout';
import RecentTable from '@/components/RecentTable';
import { Content } from 'antd/lib/layout/layout';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectReadItem } from '@/redux/crud/selectors';


export default function Details() {
  const dataTableColumns = [
    {
      title: 'N#',
      dataIndex: 'number',
    },
    {
      title: 'Client',
      dataIndex: ['client', 'company'],
    },

    {
      title: 'Total',
      dataIndex: 'total',

      render: (total) => `$ ${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        let color = status === 'Draft' ? 'volcano' : 'green';

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
  ];
  const bankColumns = [
    {
      title: 'Bank',
      dataIndex: 'number',
    },
    {
      title: 'Account type',
      dataIndex: ['client', 'company'],
    },

    {
      title: 'Name',
      dataIndex: 'total',

      render: (total) => `$ ${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    },
    {
      title: 'Account No',
      dataIndex: 'status',
      render: (status) => {
        let color = status === 'Draft' ? 'volcano' : 'green';

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
  ];
  const relatedColumns = [
    {
      title: 'Name',
      dataIndex: 'number',
    },
    {
      title: 'Last Name',
      dataIndex: ['client', 'company'],
    },

    {
      title: 'Relation',
      dataIndex: 'total',

      render: (total) => `$ ${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    },
    {
      title: 'Contact',
      dataIndex: 'status',
      render: (status) => {
        let color = status === 'Draft' ? 'volcano' : 'green';

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Address',
      dataIndex: 'total',

      render: (total) => `$ ${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    },
  ];
  const emergencyColumns = [
    {
      title: 'Name',
      dataIndex: 'number',
    },
    {
      title: 'Last Name',
      dataIndex: ['client', 'company'],
    },

    {
      title: 'Phone',
      dataIndex: 'total',

      render: (total) => `$ ${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    },
  ];
  const medicalColumns = [
    {
      title: 'Type',
      dataIndex: 'number',
    },
    {
      title: 'Description',
      dataIndex: ['client', 'company'],
    },
  ];
  const contractColumns = [
    {
      title: 'Start',
      dataIndex: 'number',
    },
    {
      title: 'End',
      dataIndex: 'number',
    },
    {
      title: 'Sal/Hr',
      dataIndex: 'number',
    },
    {
      title: 'Hr/Week',
      dataIndex: 'number',
    },
    {
      title: 'Sal/Monthly',
      dataIndex: ['client', 'company'],
    },
    {
      title: 'status',
      dataIndex: ['client', 'company'],
    },
  ];
  const customerColumns = [
    {
      title: 'Customer',
      dataIndex: 'number',
    },
    {
      title: 'Store',
      dataIndex: 'number',
    },
    {
      title: 'Hours',
      dataIndex: 'number',
    },
    {
      title: 'Hr/Week',
      dataIndex: 'number',
    },
    {
      title: 'Sal/Hr',
      dataIndex: ['client', 'company'],
    },
    {
      title: 'Type',
      dataIndex: ['client', 'company'],
    },
  ];
  const scheduleColumns = [
    {
      title: 'Hours',
      dataIndex: 'number',
    },
    {
      title: 'Monday',
      dataIndex: 'number',
    },
    {
      title: 'Tuesday',
      dataIndex: 'number',
    },
    {
      title: 'Wednesday',
      dataIndex: 'number',
    },
    {
      title: 'Tursday',
      dataIndex: ['client', 'company'],
    },
    {
      title: 'Friday',
      dataIndex: ['client', 'company'],
    },
    {
      title: 'Saturday',
      dataIndex: ['client', 'company'],
    },
    {
      title: 'Sunday',
      dataIndex: ['client', 'company'],
    },
  ];
  const paymentColumns = [
    {
      title: 'Date',
      dataIndex: 'number',
    },
    {
      title: 'Fortnight',
      dataIndex: 'number',
    },
    {
      title: 'Total Amount',
      dataIndex: 'number',
    },
    {
      title: 'Net Amount',
      dataIndex: 'number',
    },
  ];
  const [form] = Form.useForm();
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [phone, setPhone] = useState('123-456-7890');
  const [avatar, setAvatar] = useState('');
  const currentEmployeeId = useParams().id;
  const entity = "employee";
  const onFinish = (values) => {
    setName(values.name);
    setEmail(values.email);
    setPhone(values.phone);
    setAvatar(values.avatar);
    message.success('Profile updated successfully!');
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }

    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info) => {

    console.log(info, 'dfinfo')
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl) =>
        setAvatar(imageUrl),
      );
    }
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const id = useParams().id;
  const dispatch = useDispatch();

  const { result: currentItem } = useSelector(selectReadItem);

  // const { pagination, items } = currentResult;

  console.log(currentItem, 'itemsitemsitemsitemsitems')

  useEffect(() => {
    dispatch(crud.read({ entity, id }));
  }, []);

  return (
    <DashboardLayout>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Details" key="1">
          <Content style={{ padding: '0 0px' }}>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <div className="profile-card">
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    {avatar ? <Avatar shape="circle" src={avatar} size={128} /> : <UserOutlined style={{ fontSize: '44px' }} />}
                    <div style={{ marginTop: 8 }}>Change Avatar</div>
                  </Upload>
                </div>
              </Col>
              <Col span={18}>
                <p>Name : {currentItem.name}</p>
                <p>Personal ID : {currentItem.personal_id}</p>
                <p>Phone : {currentItem.phone}</p>
                <p>Email : {currentItem.email}</p>
              </Col>
            </Row>
            <div className="profile-details">
              <h2>Details</h2>
              <Form form={form} onFinish={onFinish}>
                <Row gutter={[20, 20]}>

                  <Col span={10}>
                    <Form.Item
                      name="gender"
                      label="Gender"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Select>
                        <Select.Option value="men">Men</Select.Option>
                        <Select.Option value="women">Women</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="civil_status"
                      label="Civil Status"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Select>
                        <Select.Option value="Soltero">Soltero</Select.Option>
                        <Select.Option value="Casado">Casado</Select.Option>
                        <Select.Option value="Unido">Unido</Select.Option>
                        <Select.Option value="Separado">Separado</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="birth_place"
                      label="Brith Place"
                      rules={[{ required: true, message: 'Please input your name' }]}
                      initialValue={name}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Name" />
                    </Form.Item>
                    <Form.Item
                      name="school"
                      label="School"
                      rules={[{ required: true, message: 'Please input your email!' }]}
                      initialValue={email}
                    >
                      <Input prefix={<MailOutlined />} type="email" placeholder="Email" />
                    </Form.Item>
                  </Col>
                  <Col span={10}>

                    <Form.Item
                      name="phone"
                      rules={[{ required: true, message: 'Please input your phone number!' }]}
                      initialValue={phone}
                    >
                      <Input prefix={<PhoneOutlined />} type="tel" placeholder="Phone Number" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">Save Chang es</Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>

          </Content>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Bank Account</h3>
            </div>

            <RecentTable entity={'banks'} dataTableColumns={bankColumns} />
          </div>

          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Related People</h3>
            </div>
            <RecentTable entity={'quote'} dataTableColumns={relatedColumns} />
          </div>

          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Emergency Contacts</h3>
            </div>
            <RecentTable entity={'quote'} dataTableColumns={emergencyColumns} />
          </div>

          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Medical Details</h3>
            </div>
            <RecentTable entity={'quote'} dataTableColumns={medicalColumns} />
          </div>

          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Work Contract</h3>
            </div>
            <RecentTable entity={'quote'} dataTableColumns={contractColumns} />
          </div>

        </Tabs.TabPane>
        <Tabs.TabPane tab="Work" key="2">
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Assigned Customers</h3>
            </div>

            <RecentTable entity={'invoice'} dataTableColumns={customerColumns} />
          </div>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Schedule</h3>
            </div>
            <RecentTable entity={'quote'} dataTableColumns={scheduleColumns} />
          </div>
          <div className="whiteBox shadow">
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Payment history</h3>
            </div>
            <RecentTable entity={'quote'} dataTableColumns={paymentColumns} />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Documents" key="3">
          Content of Tab Pane 3
        </Tabs.TabPane>
      </Tabs>

    </DashboardLayout>
  );
}
