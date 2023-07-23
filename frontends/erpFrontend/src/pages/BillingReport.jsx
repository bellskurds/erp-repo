import * as XLSX from 'xlsx';
import { crud } from "@/redux/crud/actions";
import { selectListsByCustomerStores, selectListsByInvoice, selectListsByRecurrent, } from "@/redux/crud/selectors";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Layout, Modal, Popconfirm, Radio, Row, Select, Table, Typography } from "antd";
import { DashboardLayout } from '@/layout';
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import useOnFetch from '@/hooks/useOnFetch';
import { request } from '@/request';


const InvoiceHistory = (props) => {
  const entity = 'invoiceHistory';
  const dispatch = useDispatch();
  const currentEmployeeId = props.parentId
  const [isModal, setIsModal] = useState(false);
  const RecurrentRef = useRef(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [monthColumns, setMonthColumns] = useState([]);
  const [billingData, setBillingData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [projectBillingData, setProjectBillingData] = useState([]);
  const [currentPeriods, setCurrentPeriods] = useState();

  const Columns = [
    {
      title: "Customer Name",
      dataIndex: 'customer_name',
      width: '10%'
    },
    {
      title: "Fact M Base",
      dataIndex: 'recurrent_amount',
      width: '10%'
    },
    {
      title: "Notes",
      dataIndex: "notes",
      width: '10%'
    },
  ];
  const TopColumns = [
    {
      title: "Customer Name",
      dataIndex: 'customer_name',
      width: '30%'
    },

  ];
  const [statisticsData, setStatisticsData] = useState([]);
  const [currentId, setCurrentId] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);

  const editModal = () => {
    setIsModal(true);
    setIsUpdate(false);
    if (RecurrentRef.current) RecurrentRef.current.resetFields();
  }
  const formattedDateFunc = (date) => {
    return new Date(date).toLocaleDateString()
  }


  const handleModal = () => {
    setIsModal(false)
  }
  const saveDetails = (values) => {
    const parentId = currentEmployeeId;
    if (currentId && parentId && isUpdate) {
      const id = currentId;
      const jsonData = { parent_id: parentId }
      dispatch(crud.update({ entity, id, jsonData: values }));
      setIsModal(false)
      setTimeout(() => {
        dispatch(crud.listByInvoice({ entity, jsonData }));
      }, 500)
    } else {
      const jsonData = { parent_id: parentId }
      const id = currentId;
      values["parent_id"] = parentId;
      dispatch(crud.create({ entity, id, jsonData: values }));
      setIsModal(false)
      setTimeout(() => {
        dispatch(crud.listByInvoice({ entity, jsonData }));
      }, 500)
    }
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const [stores, setStores] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const { result: Invoices } = useSelector(selectListsByInvoice);



  useEffect(() => {

    let current = moment(new Date(currentYear, 0, 1));
    let end = moment(new Date(currentYear, 11, 1));
    if (currentPeriods) {
      current = moment(currentPeriods[0]);
      end = currentPeriods[1];
    }
    const monthlyColumns = [];
    const sumBillingMonthly = {};
    const customersCount = {};
    const averageBilling = {};
    const growBilling = {};
    while (current.isSameOrBefore(end)) {

      const column = {
        title: current.format("MMMM").slice(0, 3),
        dataIndex: current.format("MM/YYYY"),
        width: '10%'
      }
      sumBillingMonthly[`${current.format("MM/YYYY")}`] = 0;
      customersCount[`${current.format("MM/YYYY")}`] = 0;
      averageBilling[`${current.format("MM/YYYY")}`] = 0;
      growBilling[`${current.format("MM/YYYY")}`] = 0;
      monthlyColumns.push(column)
      current = current.add(1, 'months');
    }
    setMonthColumns(monthlyColumns)
    const groupedRecurrent = invoices.reduce((acc, item) => {
      const existingItem = acc.find(i => i.recurrent_id._id === item.recurrent_id._id);
      if (!existingItem) {
        acc.push(item);
      }
      return acc;
    }, []);

    const billingData = [];

    if (customerData) {
      customerData.map(list => {
        let obj = {};
        obj.recurrent_amount = 0;
        obj.notes = list.billing_details || '';
        obj.customer_name = list.name || '';
        obj.customer_id = list._id;
        obj.recurrent_count = 0;
        if (list) {

          // to get recurrent amount in recurrent billing
          groupedRecurrent.map(recurrent => {
            const { parent_id: customer3, recurrent_id: Recurrent } = recurrent;
            if (customer3 && list._id === customer3._id) {
              obj.recurrent_amount += parseInt(Recurrent.amount) || 0;
              obj.recurrent_count++;
            }
          });
          // end to get recurrent amount
          // to get monthly data;
          invoices.map(invoice => {
            const { start_date, parent_id: customer2 } = invoice;
            const date_key = moment(new Date(start_date)).format("MM/YYYY");
            obj[date_key] = 0;
          })
          // end .......
        }
        billingData.push(obj)
      })
    }
    billingData.map((customer, index) => {
      const { customer_id, recurrent_count } = customer;
      customer['key'] = index;
      invoices.map(invoice => {
        const { parent_id: customer1, start_date, amount } = invoice;
        if (customer_id === customer1._id) {
          const date_key = moment(new Date(start_date)).format("MM/YYYY");
          customer[date_key] += amount || 0
        }
      })
      if (!recurrent_count) {
        customer.recurrent_amount = 'N/A';
        projectBillingData.map(project => {
          const { customer: customer_project, billing, created, } = project;
          if (customer_project) {
            const { _id } = customer_project;
            if (customer_id === _id) {
              const date_key = moment(new Date(created)).format("MM/YYYY");
              customer[date_key] += billing || 0
            }
          }
        })
      }
      for (var key in sumBillingMonthly) {
        sumBillingMonthly[key] += customer[key] || 0;
      }
      for (var key1 in customersCount) {

        if (recurrent_count && (customer[key1] === 0 || customer[key1])) {
          customersCount[key1]++;
        }
      }
    });
    for (var key in sumBillingMonthly) {
      if (customerData) {

        averageBilling[key] = sumBillingMonthly[key] / customerData.length;
        averageBilling[key] = (averageBilling[key]).toFixed(2)
      }
    }
    setBillingData(billingData);

    for (var key2 in growBilling) {
      const beforeKey = moment(new Date(`${key2.split("/")[0]}/1/${key2.split("/")[1]}`)).subtract(1, 'months').format("MM/YYYY");
      if (!sumBillingMonthly[key2] || !sumBillingMonthly[beforeKey]) {
        growBilling[key2] = ''
      } else {
        growBilling[key2] = `${((sumBillingMonthly[key2] - sumBillingMonthly[beforeKey]) / (sumBillingMonthly[beforeKey]) * 100).toFixed(2)}%`
      }


    }
    const statistics = [
      {
        customer_name: "Customers No. (Amount of customers billed on related month)",
        key: new Date().valueOf(),
        ...customersCount
      },
      {
        customer_name: "Billing Average (Total billing / customers billed  'for related month' )",
        key: new Date().valueOf() + 1,
        ...averageBilling
      },
      {
        customer_name: "Monthly Grow",
        key: new Date().valueOf() + 2,
        ...growBilling
      },
      {
        customer_name: "Monthly Billing (summatory of billing of all customers on related month)",
        key: new Date().valueOf() + 3,
        ...sumBillingMonthly
      }
    ]

    console.log(statistics, 'statistics')
    setStatisticsData(statistics)
  }, [
    currentYear, currentMonth, invoices, customerData, projectBillingData, currentPeriods
  ]);


  useEffect(() => {
    const id = currentEmployeeId;
    const jsonData = { parent_id: id }
    dispatch(crud.listByInvoice({ entity, jsonData }));
    const fetchData = () => {
      return request.list({ entity: 'client' });
    };
    onFetch(fetchData);
    const init = async () => {
      const { result } = await request.listById({ entity: "project" });
      setProjectBillingData(result);
    }

    init()
  }, []);
  useEffect(() => {
    if (Invoices.items) {
      // const filterData = Invoices.items.filter(obj => new Date(obj.start_date).getMonth() <= new Date().getMonth() && new Date(obj.start_date).getFullYear() <= new Date().getFullYear());
      // console.log(filterData, 'ddfilterData')
      setInvoices(Invoices.items || []);

    }
  }, [Invoices])
  const { onFetch, result } = useOnFetch();
  useEffect(() => {

    setCustomerData(result);
  }, [result])
  const exportToExcel = () => {

    const _invoices = invoices.map(obj => ({
      date: obj.start_date,
      amount: obj.amount,
      details: obj.details
    }))
    const worksheet = XLSX.utils.json_to_sheet(_invoices);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'table.xlsx');
  }
  const handleDateChange = (e) => {
    setCurrentPeriods(e);
  }
  return (
    <DashboardLayout>

      <Layout style={{ minHeight: '100vh' }}>
        <Modal title="Recurrent invoice" visible={isModal} onCancel={handleModal} footer={null} width={1000}>
          <Form
            ref={RecurrentRef}
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
              name="amount"
              label="Amount"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber width={1000} />
            </Form.Item>
            <Form.Item
              name="details"
              label="Details"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            {/* <Row gutter={24}>
                        <Col span={24}>


                        </Col>

                    </Row> */}
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              {
                isUpdate ?
                  <Button type="primary" htmlType="submit">
                    Update
                  </Button>
                  : <Button type="primary" htmlType="submit">
                    Save
                  </Button>

              }

              <Button type="ghost" onClick={handleModal}>
                cancel
              </Button>
            </Form.Item>
          </Form>
          <>
          </>
        </Modal>
        <Row>
          <Col span={10}>
            <h3 style={{ color: '#22075e', marginBottom: 5 }}>Monthly Billing Report</h3>
          </Col>
          <Col span={7}>
            <DatePicker.RangePicker picker="month" onCalendarChange={handleDateChange} />
          </Col>
          <Col span={7}>
            {/* <Button type='primary' onClick={exportToExcel}>Export to Excel</Button> */}
          </Col>
        </Row>
        <Table
          bordered
          dataSource={[...statisticsData] || []}
          columns={[...TopColumns, ...monthColumns]}
          rowClassName="editable-row"
          showHeader={false}
          pagination={false}
        />
        <Table
          bordered
          dataSource={[...billingData] || []}
          columns={[...Columns, ...monthColumns]}
          rowClassName="editable-row"
        />
      </Layout>
    </DashboardLayout>
  );
}
export default InvoiceHistory;