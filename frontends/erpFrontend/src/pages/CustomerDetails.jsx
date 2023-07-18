import React, { useRef, useState } from 'react';
import { Form, Input, Row, Col, Tabs, Upload, Avatar, Button, message, Select, Modal, Radio, } from 'antd';


import { PlusOutlined } from '@ant-design/icons';
import countryList from 'country-list'
import { DashboardLayout } from '@/layout';
import { Content } from 'antd/lib/layout/layout';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectReadItem } from '@/redux/crud/selectors';

import { DatePicker } from '@/components/CustomAntd';

import CustomerContacts from './CustomerContacts';
import CustomerStores from './CustomerStores';
import AssignedEmployee from './AssignedEmployee';
import RecurrentBilling from './RecurrentBilling';
import InvoiceHistory from './InvoiceHistory';
import BillingEsmitaion from './BillingEstimation';
import { Avatar_url } from '@/config/serverApiConfig';
import DocumentManage from './DocumentManage';
const { role } = window.localStorage.auth ? JSON.parse(window.localStorage.auth) : {};


export default function Details() {

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

  const currentCustomerId = useParams().id;

  const entity = "client";



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
  const editCustomer = () => {
    if (formRef.current)
      console.log(formRef.current.getFieldValue(), 'formRef.current')
    //formRef.current.setFieldsValue(currentItem);

    setIsModalVisible(true)
    setTimeout(() => {

      formRef.current.setFieldsValue(currentItem)
    }, 600)
  }

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

    dispatch(crud.update({ entity, id, jsonData: values }));
    setTimeout(() => {
      dispatch(crud.read({ entity, id }));
    }, 500)
    setIsModalVisible(false)
  }
  useEffect(() => {
    dispatch(crud.read({ entity, id }));
  }, [entity, id]);

  const [fileList, setFileList] = useState([]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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
                name="legal_name"
                label="Legal Name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="ruc"
                label="RUC"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="tax_residence"
                label="Tax residence"
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="billing_details"
                label="Billing details"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
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
                <p>Customer Name : {currentItem ? currentItem.name : ""}</p>
                <p>Legal Name : {currentItem ? currentItem.legal_name : ""}</p>
                <p>RUC : {currentItem ? currentItem.ruc : ""}</p>
                <p>Billing Details : {currentItem ? currentItem.billing_details : ""}</p>
              </Col>
              <Col span={6}>

                <Select style={{ width: 120 }} onChange={changeStatus} value={currentItem ? currentItem.status : 4} options={statusOptions} />
              </Col>
              <Button type="primary" onClick={editCustomer} >Edit</Button>
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

        {role !== 2 &&

          <Tabs.TabPane tab="Billing" key="3">
            <RecurrentBilling parentId={currentCustomerId} />
            <InvoiceHistory parentId={currentCustomerId} />
            <BillingEsmitaion parentId={currentCustomerId} />
          </Tabs.TabPane>
        }

      </Tabs>

    </DashboardLayout>
  );
}
