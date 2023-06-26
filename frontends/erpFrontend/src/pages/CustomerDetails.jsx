import React, { useRef, useState } from 'react';
import { Form, Input, Row, Col, Tabs, Upload, Avatar, Button, message, Select, Modal, Radio, Table, Typography, Popconfirm } from 'antd';

import { Tag } from 'antd';

import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import countryList from 'country-list'
import { DashboardLayout } from '@/layout';
import RecentTable from '@/components/RecentTable';
import { Content } from 'antd/lib/layout/layout';
import { Link, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectReadItem } from '@/redux/crud/selectors';
import { Option } from 'antd/lib/mentions';
import Dropdown from '@/components/outsideClick.js';
import { DatePicker } from '@/components/CustomAntd';
import moment from 'moment';
import { selectListItems } from '@/redux/crud/selectors';
import BankAccount from './BankAccount';
import RelatedPeople from './RelatedPeople';
import EmergencyContact from './EmergencyContact';
import MedicalDetail from './MedicalDetail';
import Contract from './Contract';
import CustomerContacts from './CustomerContacts';
import CustomerStores from './CustomerStores';
import AssignedEmployee from './AssignedEmployee';
import RecurrentBilling from './RecurrentBilling';
import InvoiceHistory from './InvoiceHistory';
import BillingEsmitaion from './BillingEstimation';
import { Avatar_url } from '@/config/serverApiConfig';
import DocumentManage from './DocumentManage';


export default function Details() {


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
  const genderOptions = [
    {
      label: "Men", value: 1,
    },
    {
      label: "Women", value: 2,
    },
  ]
  const civilOptions = [
    {
      label: "Soltero", value: 1
    },
    {
      label: "Casado", value: 2
    },
    {
      label: "Unido", value: 3
    },
    {
      label: "Separado", value: 4
    },
  ]
  const statusOptions = [
    {
      label: "Active", value: 1,
    },
    {
      label: "InActive", value: 2,
    }
    ,
    {
      label: "reject", value: 3,
    }
  ]
  const [form] = Form.useForm();
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [phone, setPhone] = useState('123-456-7890');
  const [avatar, setAvatar] = useState('');
  const currentCustomerId = useParams().id;

  const entity = "client";
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



  const id = useParams().id;


  console.log(id, '33333333333333333334444444444444444')
  const dispatch = useDispatch();

  const { result: currentItem } = useSelector(selectReadItem);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // const { pagination, items } = currentResult;
  const changeStatus = (e) => {
    const id = currentCustomerId;
    dispatch(crud.update({ entity, id, jsonData: { status: e } }));
    setTimeout(() => {
      dispatch(crud.read({ entity, id }));
    }, 500)
    return true;
  }



  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const formRef = useRef(null);

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const editModal = () => {
    if (formRef.current)
      console.log(formRef.current.getFieldValue(), 'formRef.current')
    //formRef.current.setFieldsValue(currentItem);

    setIsModalVisible(true)
    setTimeout(() => {

      formRef.current.setFieldsValue({
        gender: currentItem.gender,
        address: currentItem.address,
        birthplace: currentItem.birthplace,
        civil_status: currentItem.civil_status,
        school: currentItem.school,
        // birthday:moment(new Date(currentItem.birthday),'mm/dd/yyyy')
      })
    }, 600)
  }
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value) => {
    // const id = 

    console.log('search:', value);
  };

  const countryLists = countryList.getData().map((item) => ({
    value: item.code,
    label: item.name
  }))
  const formatDate = (date) => {
    date = date.$d;
    const day = date.getDate().toString().padStart(2, '0'); // padStart adds a zero if the length of the string is less than 2 characters
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    // combine the day, month and year into a single string in mm/dd/yyyy format
    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
  }
  const saveDetails = (values) => {
    console.log(values, 'valuesvalues')
    values['birthday'] = formatDate(values['birthday']);
    dispatch(crud.update({ entity, id, jsonData: values }));
    setTimeout(() => {
      dispatch(crud.read({ entity, id }));
    }, 500)
    setIsModalVisible(false)
  }
  useEffect(() => {
    dispatch(crud.read({ entity, id }));
  }, [entity, id]);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };
  const handleChange = ({ fileList }) => setFileList(fileList);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  const handlePreviewImageCancel = () => {
    setPreviewVisible(false);
  }
  const handleUpload = (file) => {

    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('id', id);
    dispatch(crud.upload({ entity, jsonData: formData }));
    message.info(`Uploading ${file.name}...`);
    setTimeout(() => {
      dispatch(crud.read({ entity, id }));
    }, 500)
  };
  console.log(currentItem, 'currentItemcurrentItemcurrentItemcurrentItemcurrentItemcurrentItem')

  return (
    <DashboardLayout>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Details" key="1">
          <Modal title="Create Form" visible={isModalVisible} onCancel={handleCancel} footer={null}>
            <Form
              ref={formRef}
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              onFinish={saveDetails}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              initialValues={{
                gender: 1,
                civil_status: 3,
                birthplace: "AU",

              }}
            >
              <Form.Item
                name="gender"
                label="Gender"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Radio.Group name="radiogroup" options={genderOptions} />
              </Form.Item>
              <Form.Item
                name="birthplace"
                label="Birthplace"
              >
                <Select
                  showSearch
                  placeholder="Select a person"
                  optionFilterProp="children"
                  onChange={onChange}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={countryLists}
                />
              </Form.Item>
              <Form.Item
                name="birthday"
                label="BirthDay"
              >
                <DatePicker style={{ width: '50%' }} format={"MM/DD/YYYY"} />
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
                <Radio.Group name="civil_status" options={civilOptions} />
              </Form.Item>
              <Form.Item
                name="school"
                label="School"
              >
                <Input />

              </Form.Item>
              <Form.Item
                name="address"
                label="Address"
              >
                <Input value={"addddr"} />
              </Form.Item>
              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                {

                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>

                }

                <Button type="ghost" onClick={handleCancel}>
                  cancel
                </Button>
              </Form.Item>
            </Form>
            <>
            </>
          </Modal>

          <Content style={{ padding: '0 0px' }}>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                {
                  (currentItem && currentItem.avatar) ?
                    <>

                      <Avatar
                        size={128}
                        src={`${Avatar_url}${currentItem ? currentItem.avatar : ""}`}
                      />
                    </>

                    :
                    <div className="profile-card">
                      <Upload
                        showUploadList={false}
                        name='avatar'
                        listType="picture-card"
                        beforeUpload={handleUpload}
                      >
                        {fileList.length >= 1 ? null : uploadButton}
                      </Upload>
                    </div>
                }
              </Col>
              <Col span={12}>
                <p>Name : {currentItem ? currentItem.name : ""}</p>
                <p>Customer ID : {currentItem ? currentItem.customer_id : ""}</p>
                <p>Phone : {currentItem ? currentItem.phone : ""}</p>
                <p>Email : {currentItem ? currentItem.email : ""}</p>
              </Col>
              <Col span={6}>
                <Select style={{ width: 120 }} onChange={changeStatus} value={currentItem ? currentItem.status : 4} options={statusOptions} />

              </Col>
            </Row>
            {/* <div className="profile-details">
              <Row>
                <Col span={3}>
                  <h2>Details</h2>
                </Col>
                <Col span={12}>
                  <Button type="primary" onClick={editModal}>Edit</Button>
                </Col>
              </Row>


            </div> */}

          </Content>
          <CustomerContacts parentId={currentCustomerId} />
          <CustomerStores parentId={currentCustomerId} />
          <AssignedEmployee parentId={currentCustomerId} />
          {/* <RelatedPeople parentId={currentCustomerId} /> */}
          {/* <EmergencyContact parentId={currentCustomerId} /> */}
          {/* <MedicalDetail parentId={currentCustomerId} /> */}
          {/* <Contract parentId={currentCustomerId} /> */}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Documents" key="2">
          <DocumentManage parentId={currentCustomerId} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Billing" key="3">
          <RecurrentBilling parentId={currentCustomerId} />
          <InvoiceHistory parentId={currentCustomerId} />
          <BillingEsmitaion parentId={currentCustomerId} />
        </Tabs.TabPane>

      </Tabs>

    </DashboardLayout>
  );
}
