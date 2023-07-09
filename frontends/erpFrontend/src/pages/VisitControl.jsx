import { DashboardLayout, } from '@/layout';
import { LeftOutlined, RightOutlined, SafetyOutlined, SearchOutlined, SkinOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Layout, Modal, Radio, Row, Select, Table, message } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import { request } from '@/request';
import moment from 'moment';
import SelectAsync from '@/components/SelectAsync';

const VisitControl = () => {
  const entity = "visitControl"
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [rangeDate] = useState();
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
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const [customerStores, setCustomerStores] = useState([]);
  const [globalData, setGlobalData] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [changeStatus, setChangeStatus] = useState(false);
  const [changedMonth, setChangedMonth] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [currentId, setCurrentId] = useState('');
  const [currentItem, setCurrentItem] = useState({});
  const [paginations, setPaginations] = useState([])
  const [visitContols, setVisitControls] = useState([]);
  const [isHistory, setIsHistory] = useState(false);

  const isEditing = (record) => record._id === editingKey;
  const editItem = (item) => {

    if (item) {
      const { customer, store } = item
      const filteredData = visitContols.filter(({ customer: customer1, store: store1, visit_date }) =>
        customer._id === customer1._id && store._id === store1._id &&
        new Date(visit_date).getFullYear() === currentYear
        && new Date(visit_date).getMonth() === (currentMonth - 1)
      )

      console.log(item, filteredData, 'globalData');
      // setTimeout(() => {

      //   const { employees, _id, removed, enabled, created, periods, ...otherValues } = item;
      //   if (formRef.current) formRef.current.setFieldsValue({ ...otherValues, periods: periods ? [moment(periods[0]), moment(periods[1])] : null });
      //   setEmployeeList(JSON.parse(employees))

      // }, 200);
      // console.log(item, '33334343');
      // setCurrentItem(item);

      setCurrentId(item._id);
      setIsModalVisible(true);
      setIsUpdate(true);
    }
  }

  const columns = [
    {
      title: 'Client(Branch)',
      dataIndex: ['customer', 'name'],
      width: '15%',
      render: (text, { store, ...otherObj }) => {
        return (<label style={{ cursor: 'pointer' }} onClick={() => editItem({ store, ...otherObj })}>`${text}(${store.store})`</label>)
      }
    },
    {
      title: 'T',
      dataIndex: 'store_visit_value',
      width: '15%',
      // render: (_, record) => {
      //   const { store } = record;
      //   const { visit_value } = store;
      //   return visit_value
      // }
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
        return ((parseFloat(record.store_visit_value) || 0) - (parseFloat(record.visit_value) || 0));
      }
    },
    {
      title: 'INSU',
      dataIndex: ['store', 'insumos'],
      width: '15%',
      render: (_, record) => {
        const { store } = record;
        const { insumos } = store;
        return insumos ? "YES" : "NO"
      }

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


    const { id: userId } = JSON.parse(localStorage.auth)
    values['by'] = userId
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

  useEffect(() => {
    const filteredData = globalData.filter((record) => {
      const { customer, store } = record;
      return (
        (!searchText || customer['name'].toString().toLowerCase().includes(searchText.toLowerCase()) ||
          store['store'].toString().toLowerCase().includes(searchText.toLowerCase()))
      );
    })
    setFilterData(filteredData);
    setPaginations({ current: 1, pageSize: 10, total: filteredData.length })
  }, [searchText, rangeDate])

  const handelDataTableLoad = useCallback((pagination) => {
    const { current, total } = pagination;

    console.log(pagination, 'pagination');
    setPaginations(pagination)
    return true;
  }, [filterData, searchText]);
  const closeModal = () => {
    setIsHistory(!isHistory);
  }
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
      setVisitControls(visitDatas);
      const { result: customerStores } = await request.list({ entity: "customerStores" });
      setCustomerStores(customerStores)
      const storeData = customerStores.map(obj => {
        const { parent_id, ...otherObj } = obj;
        return {
          store: otherObj,
          customer: parent_id
        }
      })

      // console.log(storeData, 'customerStores');

      const fillteredData = visitDatas.filter(({ visit_date }) =>
      (
        new Date(visit_date).getFullYear() === currentYear
        && new Date(visit_date).getMonth() === (currentMonth - 1)
      )
      )
      storeData.map((obj, index) => {
        const { store, customer } = obj;
        const { visit_value } = store;
        obj['store_visit_value'] = visit_value || 0;
        obj['visit_value'] = 0;
        obj['key'] = index;
        fillteredData.map(data => {
          const { store: store1, customer: customer1, visit_date, type } = data;
          if (store._id === store1._id && customer._id === customer1._id) {
            obj['visit_value']++;
            obj[`day_${getDate(visit_date)}`] = visitType[type]
          }
        })
      })
      setFilterData(storeData)
      setGlobalData(storeData)

      setPaginations({ current: 1, pageSize: 10, total: storeData.length })
    }
    init();

  }, [
    currentMonth, currentYear, changeStatus
  ])
  const getDate = (value) => {
    return moment(value).format("YYYY-MM-DD")
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

        <Modal title="History Form" visible={isHistory} onCancel={closeModal} footer={null} width={700}>

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