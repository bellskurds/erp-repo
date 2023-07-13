import { DashboardLayout, } from '@/layout';
import { LeftOutlined, RightOutlined, SafetyOutlined, SearchOutlined, SkinOutlined, StopOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Layout, Modal, Popconfirm, Radio, Row, Select, Table, Typography, message } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { crud } from '@/redux/crud/actions';
import { request } from '@/request';
import moment from 'moment';
import SelectAsync from '@/components/SelectAsync';

const getBusinessDays = (year, month) => {
  const startDate = 1;
  const endDate = new Date(year, month, 0).getDate();
  let businessDays = 0;
  for (let date = startDate; date <= endDate; date++) {
    if (new Date(year, month - 1, date).getDay() !== 0) {
      businessDays++;
    }
  }
  console.log(year, 'year,month', month, businessDays);

  return businessDays;
}


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
  const visitLabel = [
    '',
    'Visit',
    'Products',
    'Inspection',
  ]
  const { id: currentUserId, role } = JSON.parse(localStorage.auth)
  const formattedDateFunc = (date) => {
    return moment(date).format("MM/DD/YYYY")
  }
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
  const [form] = Form.useForm();
  const [currentId, setCurrentId] = useState('');
  const [paginations, setPaginations] = useState([])
  const [visitContols, setVisitControls] = useState([]);
  const [isHistory, setIsHistory] = useState(false);
  const [historyData, setHistoryData] = useState([])
  const [reportData, setReportData] = useState([]);
  const editItem = (item) => {
    if (item) {
      const { customer, store } = item
      const filteredData = visitContols.filter(({ customer: customer1, store: store1, visit_date }) =>
        customer._id === customer1._id && store._id === store1._id &&
        new Date(visit_date).getFullYear() === currentYear
        && new Date(visit_date).getMonth() === (currentMonth - 1)
      )
      filteredData.sort((a, b) => { return new Date(a.visit_date) - new Date(b.visit_date) })
      setHistoryData(filteredData)
      setCurrentId(item._id);
      setIsHistory(true);
    }
  }

  const columns = [
    {
      title: 'Client(Branch)',
      dataIndex: ['customer', 'name'],
      width: '15%',
      render: (text, { store, ...otherObj }) => {
        return (<label style={{ cursor: 'pointer' }} onClick={() => editItem({ store, ...otherObj })}>{text}({store.store})</label>)
      }
    },
    {
      title: 'T',
      dataIndex: 'store_visit_value',
      width: '15%',
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
  ];

  const topColumn = [
    {
      title: "........................................",
      width: "40%",
      dataIndex: "report_title"
    },
    {
      title: "....",
      width: "15%",
      dataIndex: 'report_value'
    },
    {
      title: "..."
    },
    {
      title: "..."
    },
    {
      title: "..%...",
      width: "20"
    },

  ]

  const onFinish = async (values) => {


    values['by'] = currentUserId
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

      let inspectionDataByuser = {};

      while (currentDate.isSameOrBefore(end)) {
        const monthLable = currentDate.format("MMMM");
        const day = currentDate.format("DD")
        const year = currentDate.year();
        const month = currentDate.format("MM");
        daysColumns.push({
          title: `${day}-${monthLable}`,
          dataIndex: `day_${year}-${month}-${day}`,
        })
        inspectionDataByuser[`day_${year}-${month}-${day}`] = 0;
        currentDate = currentDate.add(1, 'days');
      };
      setChangedMonth(daysColumns)


      const { result: visitDatas } = await request.listById({ entity: "visitControl" });
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
          const { store: store1, customer: customer1, visit_date, type, status } = data;
          if (store._id === store1._id && customer._id === customer1._id) {
            if (status) {
              obj[`day_${getDate(visit_date)}`] = visitType[type]
              obj['visit_value']++;
            }
          }
        })
      })

      setFilterData(storeData)
      setGlobalData(storeData)

      // I would like to display inspection data by user per day... ------start-----


      fillteredData.map(item => {
        const { type, visit_date, status } = item
        if (status && type === 3) {
          Object.keys(inspectionDataByuser).map(key => {
            if (key === `day_${getDate(visit_date)}`) {
              inspectionDataByuser[`day_${getDate(visit_date)}`]++
            }
          })
        }
      })
      const totalInspection = getTotalInspection(inspectionDataByuser)

      // -------------------------------end----------------------------------------


      setPaginations({ current: 1, pageSize: 10, total: storeData.length })


      const initReportData = [
        {
          key: 0,
          report_title: "Business days",
          report_value: getBusinessDays(currentYear, currentMonth),
        },
        {
          key: 1,
          report_title: "Inspections carried out",
          ...inspectionDataByuser,
          report_value: totalInspection
        },
        {
          key: 2,
          report_title: "Projection to date"
        },
        {
          key: 3,
          report_title: "month projection"
        },

        {
          key: 4,
          report_title: "Supplies delivered"
        },
        {
          key: 5,
          report_title: "Projection to date"
        },
        {
          key: 6,
          report_title: "month projection"
        },
        {
          key: 7,
          report_title: "Visits made"
        },
        {
          key: 8,
          report_title: "Delivered projects"
        },
      ]
      setReportData(initReportData);
    }
    init();

  }, [
    currentMonth, currentYear, changeStatus
  ])

  const getTotalInspection = (record) => {
    let total = 0;
    for (var key in record) {
      total += parseInt(record[key]) || 0;
    }
    return total;
  }
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
  const updateHistory = async (_item) => {

    const { _id } = _item;
    const jsonData = { status: 0, by: currentUserId };
    const { result } = await request.update({ entity, id: _id, jsonData: jsonData })
    // dispatch(crud.update({ entity, id: _id, jsonData: jsonData }))
    const newData = [...historyData];
    const index = newData.findIndex((item) => item._id === _id);
    // const item = newData[index];
    newData[index] = result
    console.log(JSON.parse(JSON.stringify(newData)), 'newData');
    setHistoryData([...newData])
    setChangeStatus(!changeStatus)
  }
  const historyColumns = [
    {
      title: "Date",
      dataIndex: 'visit_date',
      render: (_) => {
        return formattedDateFunc(_)
      }
    }
    ,
    {
      title: "Type",
      dataIndex: 'type',
      render: (_) => {
        return visitLabel[_];
      }
    }
    ,
    {
      title: "Comment",
      dataIndex: 'comments'
    }
    ,
    {
      title: "By",
      dataIndex: ['by', 'name']
    }
    ,

    {
      title: "Action",
      dataIndex: 'operation',
      width: "10%",
      align: 'center',
      render: (_, record) => {
        const { status } = record;
        return (
          status === 0 ?
            'Canceled'
            :
            role === 0 ?
              <>
                <Typography.Text>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => updateHistory(record)} >
                    <StopOutlined style={{ fontSize: "20px" }} />
                  </Popconfirm>
                </Typography.Text>

              </>
              : ""
        )

      },
    }
  ]

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
          <Table
            columns={historyColumns}
            dataSource={historyData || []}
            rowKey={(item) => item._id}
          />
        </Modal>
        <Layout >
          <Row gutter={24} style={{ textAlign: 'right' }}>
            <Col span={24}>

              <h3 style={{ textAlign: 'center' }}>
                <LeftOutlined onClick={prevData} />
                <label>{moment(new Date(currentYear, currentMonth - 1, 1)).format("MMMM")} {currentYear}</label>
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
              dataSource={reportData}
              columns={[...topColumn, ...changedMonth]}
              rowClassName="editable-row"
            />
          </Form>

          <Form form={form} component={false}>
            <Table
              style={{ overflow: 'auto' }}
              bordered
              dataSource={filterData}
              columns={[...columns, ...changedMonth]}
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