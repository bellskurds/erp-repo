import { DashboardLayout, DefaultLayout } from '@/layout';
import { AliwangwangOutlined, DeleteOutlined, EditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, InputNumber, Layout, Modal, Popconfirm, Radio, Row, Select, Space, Table, Tag, Typography } from 'antd';
import Search from 'antd/lib/transfer/search';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { request } from '@/request';
import moment from 'moment';
import SelectAsync from '@/components/SelectAsync';
import { useContext } from 'react';
const EditableContext = React.createContext(null);

const statusLabel = ["", "Active", "Canceled", "Finished"]
const statusArr = [
  { value: 0, label: "all" },
  { value: 1, label: "Active" },
  { value: 2, label: "Canceled" },
  { value: 3, label: "Finished" },
];
const statusArr1 = [
  { value: 1, label: "Active" },
  { value: 2, label: "Canceled" },
  { value: 3, label: "Finished" },
];

const getFormattedHours = (days) => {
  const dayLabels = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];
  const hours = [];

  for (let i = 0; i < days.length; i++) {
    if (!days[i]) continue
    const [start, end] = days[i];

    if (start === end) {
      hours.push(dayLabels[i] + ' ' + new Date(start).getHours());
    } else if (i === 0 || start !== days[i - 1][0] || end !== days[i - 1][1]) {
      hours.push(dayLabels[i] + '( ' + new Date(start).getHours() + '-' + new Date(end).getHours() + ')');
    }
  }
  return hours.join(', ');
}
const getTotalWeekHours = (days) => {
  let totalHours = 0;

  for (const day of days) {
    const startTime = day[0];
    const endTime = day[1];

    const startHour = parseInt(startTime);
    const endHour = parseInt(endTime);

    const hours = endHour - startHour;
    totalHours += hours;
  }
  return totalHours;

}
const employeeColumns = [
  {
    title: "Name",
    dataIndex: "name"
  },
  {
    title: "Hours",
    dataIndex: "hours"
  },
  {
    title: "Salary",
    dataIndex: "salary"
  },
  {
    title: "Contract",
    dataIndex: "contract"

  },
  {
    title: "Hrs/sem",
    dataIndex: "hr_week"
  },
]
const Store = () => {
  const entity = "customerStores"
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [currentProducts, setCurrentProducts] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const [rangeDate, setRangeDate] = useState();
  const [isModal, setIsModal] = useState(false);
  const [employeeDatas, setEmployeeDatas] = useState([]);

  useEffect(() => {

    if (currentProducts) setIsProducts(true)
  }, [
    currentProducts
  ])
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

  const [employeeList, setEmployeeList] = useState([]);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [currentId, setCurrentId] = useState('');
  const [currentItem, setCurrentItem] = useState({});
  const [references, setReferences] = useState([]);
  const [initEmployeeColumns, setInitEmployeeColumns] = useState([]);
  const [paginations, setPaginations] = useState([])
  const [endDate, setEndDate] = useState();
  const [status, setStatus] = useState();
  const [summatoryCost, setSummatoryCost] = useState();
  const isEditing = (record) => record._id === editingKey;
  const editItem = (item) => {

    if (item) {

      setTimeout(() => {

        const { employees, _id, removed, enabled, created, periods, ...otherValues } = item;
        if (formRef.current) formRef.current.setFieldsValue({ ...otherValues, periods: periods ? [moment(periods[0]), moment(periods[1])] : null });
        setEmployeeList(JSON.parse(employees))

      }, 200);
      console.log(item, '33334343');
      setCurrentItem(item);

      setCurrentId(item._id);
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
  const getDateLabel = (date) => {
    if (!date) return '';
    const start = moment(date[0]);
    const end = moment(date[1]);
    return `${start.format("MMMM")}${start.date()}(${start.year()}) - ${end.format("MMMM")}${end.date()}(${end.year()})`
  }


  const typeArr = ["", "Residential", "Commercial"]
  const columns = [
    {
      title: 'Customer',
      dataIndex: ['parent_id', 'name'],
      width: '15%',
    },
    {
      title: 'Store',
      dataIndex: 'store',
      width: '15%',
    },
    {
      title: 'Email',
      dataIndex: ['parent_id', 'email'],
      width: '15%',
    },
    {
      title: 'Waze',
      dataIndex: 'waze_location',
      width: '15%',
      render: (_) => {
        return <a target="_blank" rel='noreferrer' href={`https://waze.com/ul?ll=${_}&navigate=yes"`}>
          <AliwangwangOutlined style={{ fontSize: "20px" }} />
        </a>
      }
    },
    {
      title: 'Employees',
      dataIndex: 'employees',
      width: '15%',
      render: (_, record) => {
        const { employees_ } = record
        return <label onClick={() => showEmployees(employees_)}>{_}</label>
      }
    },
    {
      title: 'Products',
      dataIndex: 'products',
      width: '15%',
      render: (text, record) => {
        const { products } = record
        return text && <EyeOutlined onClick={() => setCurrentProducts(products)} style={{ fontSize: "20px" }} />
      }
    },
    {
      title: 'Specs',
      dataIndex: 'spec',
      width: '15%',

    },
  ];

  const showEmployees = (data) => {
    setIsModal(true)
    const lists = []
    data.map((item, index) => {
      const { contract, store, employee, hr_week } = item;
      const obj = {
        key: index,
        name: employee.name,
        hours: getFormattedHours(
          [
            store.monday ? [store.monday[0], store.monday[1]] : "",
            store.tuesday ? [store.tuesday[0], store.tuesday[1]] : "",
            store.wednesday ? [store.wednesday[0], store.wednesday[1]] : "",
            store.thursday ? [store.thursday[0], store.thursday[1]] : "",
            store.friday ? [store.friday[0], store.friday[1]] : "",
            store.saturday ? [store.saturday[0], store.saturday[1]] : "",
            store.sunday ? [store.sunday[0], store.sunday[1]] : "",
          ]
        ),
        salary: contract.sal_monthly,
        contract: `${contract.start_date}-${contract.end_date}`,
        hr_week: getTotalWeekHours(
          [
            store.monday ? [new Date(store.monday[0]).getHours(), new Date(store.monday[1]).getHours()] : [0, 0],
            store.tuesday ? [new Date(store.tuesday[0]).getHours(), new Date(store.tuesday[1]).getHours()] : [0, 0],
            store.wednesday ? [new Date(store.wednesday[0]).getHours(), new Date(store.wednesday[1]).getHours()] : [0, 0],
            store.thursday ? [new Date(store.thursday[0]).getHours(), new Date(store.thursday[1]).getHours()] : [0, 0],
            store.friday ? [new Date(store.friday[0]).getHours(), new Date(store.friday[1]).getHours()] : [0, 0],
            store.saturday ? [new Date(store.saturday[0]).getHours(), new Date(store.saturday[1]).getHours()] : [0, 0],
            store.sunday ? [new Date(store.sunday[0]).getHours(), new Date(store.sunday[1]).getHours()] : [0, 0],
          ]
        )
      }
      lists.push(obj);
    })
    setEmployeeDatas(lists)

    console.log(data);
  }

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

    values['employees'] = JSON.stringify(employeeList);
    // const obj1 = JSON.parse(currentItem.employees);
    // const obj2 = employeeList;
    // const result = getObjectDiff(obj1, obj2);
    // console.log(result, '2222222222');
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
    handleCancel()
  };
  const formRef = useRef(null);
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const getObjectDiff = (obj1, obj2) => {
    const diff = [];

    // Check for changed properties and values
    for (let i = 0; i < obj1.length; i++) {
      const obj1Props = Object.keys(obj1[i]);
      const obj2Props = Object.keys(obj2[i]);
      const changedProps = [];

      for (let prop of obj1Props) {
        if (obj2[i].hasOwnProperty(prop) && obj1[i][prop] !== obj2[i][prop]) {
          changedProps.push({ [prop]: obj2[i][prop] });
        }
      }

      if (changedProps.length > 0) {
        diff.push({ index: i, changes: changedProps });
      }
    }

    // Check for added properties and values
    for (let i = 0; i < obj2.length; i++) {
      const obj2Props = Object.keys(obj2[i]);

      for (let prop of obj2Props) {
        let found = false;

        for (let j = 0; j < obj1.length; j++) {
          if (obj1[j].hasOwnProperty(prop)) {
            found = true;
            break;
          }
        }

        if (!found) {
          diff.push({ index: i, added: { [prop]: obj2[i][prop] } });
        }
      }
    }

    return diff;
  }
  const ExtraWeek = () => {
    const start_ = endDate.date();
    const end_ = start_ + 7;

    let currentDate = endDate;
    let dates = []; // Array to store the next 7 days
    for (let i = start_; i < end_; i++) {
      dates.push({ title: currentDate.format('YYYY-MM-DD'), dataIndex: `day_${currentDate.format('YYYY-MM-DD')}`, editable: true, render: (text) => { return (text || 0) } }); // Add the formatted date to the array
      currentDate = currentDate.add(1, 'day'); // Increment the current date by 1 day
    }

    setInitEmployeeColumns([...initEmployeeColumns, ...dates]);
  }

  const addEmployee = () => {
    const defaultObj = {};
    for (var i = 0; i < initEmployeeColumns.length; i++) {
      var { dataIndex } = initEmployeeColumns[i];
      if (dataIndex.includes('day_')) {
        defaultObj[dataIndex] = 0;
      }
    }
    setEmployeeList([...employeeList, { key: new Date().valueOf(), ...defaultObj }])
  }
  useEffect(() => {
    dispatch(crud.resetState());
    dispatch(crud.list({ entity }));

  }, []);
  useEffect(() => {

    async function init() {
      const { result: assignedEmployees } = await request.list({ entity: "assignedEmployee" });
      items.map(item => {
        const { _id: store_id } = item
        item['employees_'] = [];
        assignedEmployees.map(obj => {
          const { store } = obj
          const { _id: store_id1 } = store;
          if (store_id === store_id1) {
            item['employees_'].push(obj)
          }
        })
        item['employees'] = item['employees_'].length
      })
      console.log(items, 'items1111');
      setFilterData(items);
      setPaginations(pagination)
    }
    init();
  }, [items, pagination])
  const handleSave = (row, values) => {

    console.log(values, row, '33333');
    const newData = [...employeeList];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setEmployeeList(prev => {
      const newValue = [...newData];
      return newValue
    });
  };
  useEffect(() => {
    const newData = [...employeeList];
    newData.map(obj => [
      initEmployeeColumns.map(columns => {
        const { dataIndex } = columns;
        if (dataIndex.includes('day_') && !obj.hasOwnProperty(dataIndex)) {
          obj[dataIndex] = 0;
        }
      })
    ])
  }, [initEmployeeColumns])

  const totalHours = (record) => {
    var total = 0;
    for (var key in record) {
      if (key.includes('day_')) {
        total += parseFloat(record[key]);
      }
    }
    return total;
  }

  const changeEmployee = (value, record) => {

    record.employee = value;
    const updatedData = employeeList.map((item) => {
      if (item.key === record.key) {
        return record;
      }
      return item;
    });
  }
  useEffect(() => {
    const filteredData = items.filter((record) => {
      const { customer } = record;

      const recordStartDate = record.periods ? new Date(moment(record.periods[0]).format("YYYY-MM-DD")) : null;
      const recordEndDate = record.periods ? new Date(moment(record.periods[1]).format("YYYY-MM-DD")) : null;
      const startDate = rangeDate ? new Date(rangeDate[0].format("YYYY-MM-DD")) : null;
      const endDate = rangeDate ? new Date(rangeDate[1].format("YYYY-MM-DD")) : null;
      return (
        (!searchText || record['project_id'].toString().toLowerCase().includes(searchText.toLowerCase()) ||
          customer['name'].toString().toLowerCase().includes(searchText.toLowerCase())) &&
        (!rangeDate || (startDate && endDate && recordStartDate >= startDate && recordEndDate <= endDate)) &&
        (!status || record.status === status)
      );

    })
    setFilterData(filteredData);
    setPaginations({ current: 1, pageSize: 10, total: filteredData.length })
  }, [searchText, status, rangeDate])

  const handelDataTableLoad = useCallback((pagination) => {
    const { current, total } = pagination;
    setPaginations(pagination)
    return true;
  }, [filterData, searchText]);
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
  const [isProducts, setIsProducts] = useState(false);
  const handleProducts = () => {
    setIsProducts(false)
  }
  const cancelModal = () => {
    setIsModal(false)
  }
  return (

    <DashboardLayout>
      <Layout style={{ minHeight: '100vh' }}>

        <Modal title="Products" visible={isProducts} onCancel={handleProducts} footer={null}>
          <h3>{currentProducts}</h3>
        </Modal>

        <Modal title="Employees" visible={isModal} onCancel={cancelModal} footer={null} width={1000}>
          <Table
            columns={employeeColumns}
            dataSource={employeeDatas || []}
          />
        </Modal>
        <Layout>
          <Row gutter={24} style={{ textAlign: 'right' }}>
            <Col span={6}>
              <Input
                placeholder='Search'
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col span={6}>
              <DatePicker.RangePicker value={rangeDate} onChange={(e) => { setRangeDate(e) }} />
            </Col>
            <Col span={12}>
              <Select
                placeholder="Status Filter"
                optionFilterProp="children"
                onChange={(e) => { setStatus(e) }}
                options={statusArr} />
              <Button onClick={showModal} type="primary">Create Project</Button>
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
export default Store;