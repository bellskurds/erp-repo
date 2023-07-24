import { crud } from "@/redux/crud/actions";
import { selectListsByCustomerStores } from "@/redux/crud/selectors";
import { DeleteOutlined, EditOutlined, EyeOutlined, } from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Popconfirm, Radio, Row, Table, TimePicker, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { request } from "@/request";
import SelectAsync from "@/components/SelectAsync";
const { role } = window.localStorage.auth ? JSON.parse(window.localStorage.auth) : {};

const compare = (a, b) => {
    if (a.primary && !b.primary) {
        return -1; // a comes before b
    } else if (!a.primary && b.primary) {
        return 1; // b comes before a
    } else {
        return 0; // no change in order
    }
};
const CustomerStores = (props) => {
    const entity = 'customerStores';
    const dispatch = useDispatch();
    const currentEmployeeId = props.parentId
    const [isBankModal, setIsBankModal] = useState(false);
    const formRef = useRef(null);
    const [insumos, setInsumos] = useState(false);

    const [labourBilling, setLabourBilling] = useState(0);
    const [productBilling, setProductBilling] = useState(0);
    const [otherBilling, setOtherBilling] = useState(0);
    const [listItems, setListItems] = useState([]);
    const [employeeDatas, setEmployeeDatas] = useState([]);
    useEffect(() => {
        console.log(labourBilling + productBilling + otherBilling);
        if (formRef.current) {
            formRef.current.setFieldsValue({
                billing: (labourBilling || 0) + (productBilling || 0) + (otherBilling || 0)
            })
        }
    }, [
        labourBilling, productBilling, otherBilling
    ])
    const bankColumns = [
        {
            title: 'Store',
            dataIndex: 'store',
        },
        {
            title: 'Employees',
            dataIndex: 'employees',
            render: (_, record) => {
                const { employees_ } = record
                return <label onClick={() => showEmployees(employees_)}>{_}</label>
            }
        },
        {
            title: 'Hours',
            dataIndex: 'hours',
            render: (text, record) => (
                <>
                    {getFormattedHours(
                        [
                            record.monday ? [record.monday[0], record.monday[1]] : "",
                            record.tuesday ? [record.tuesday[0], record.tuesday[1]] : "",
                            record.wednesday ? [record.wednesday[0], record.wednesday[1]] : "",
                            record.thursday ? [record.thursday[0], record.thursday[1]] : "",
                            record.friday ? [record.friday[0], record.friday[1]] : "",
                            record.saturday ? [record.saturday[0], record.saturday[1]] : "",
                            record.sunday ? [record.sunday[0], record.sunday[1]] : "",
                        ]
                    )}
                </>
            ),

        },

        {
            title: 'Hr/sem',
            dataIndex: 'hr_week',
            render: (text, record) => (
                <>
                    {getTotalWeekHours(
                        [
                            record.monday ? [new Date(record.monday[0]).getHours(), new Date(record.monday[1]).getHours()] : [0, 0],
                            record.tuesday ? [new Date(record.tuesday[0]).getHours(), new Date(record.tuesday[1]).getHours()] : [0, 0],
                            record.wednesday ? [new Date(record.wednesday[0]).getHours(), new Date(record.wednesday[1]).getHours()] : [0, 0],
                            record.thursday ? [new Date(record.thursday[0]).getHours(), new Date(record.thursday[1]).getHours()] : [0, 0],
                            record.friday ? [new Date(record.friday[0]).getHours(), new Date(record.friday[1]).getHours()] : [0, 0],
                            record.saturday ? [new Date(record.saturday[0]).getHours(), new Date(record.saturday[1]).getHours()] : [0, 0],
                            record.sunday ? [new Date(record.sunday[0]).getHours(), new Date(record.sunday[1]).getHours()] : [0, 0],
                        ]
                    )}
                </>
            ),
        },
        {
            title: 'Location',
            dataIndex: 'location',
        },
        {
            title: 'Waze Location',
            dataIndex: 'waze_location',
        },
        {
            title: 'Billing',
            dataIndex: 'billing',
        },
        {
            title: 'Products',
            dataIndex: 'products',
            render: (text, record) => (
                <Typography.Link onClick={() => showProducts(record.products)}>
                    <EyeOutlined style={{ fontSize: "20px" }} />
                </Typography.Link>
            ),
        },
        {
            title: 'Actions',
            dataIndex: 'operation',
            width: "10%",
            align: 'center',
            render: (_, record) => {
                return (
                    role === 0 ?
                        <>
                            <Typography.Link onClick={() => editItem(record)}>
                                <EditOutlined style={{ fontSize: "20px" }} />
                            </Typography.Link>

                            <Popconfirm title="Sure to delete?" onConfirm={() => deleteItem(record)}>
                                <DeleteOutlined style={{ fontSize: "20px" }} />
                            </Popconfirm>
                        </> : ''
                )

            },
        },
    ];
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
    const [currentId, setCurrentId] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);

    const editBankModal = () => {
        setLabourBilling(0);
        setProductBilling(0);
        setOtherBilling(0)
        setIsBankModal(true);
        setIsUpdate(false);
        if (formRef.current) formRef.current.resetFields();
        setSundayValue(false)
        setSaturdayValue(false)
        setFridayValue(false)
        setTursdayValue(false)
        setWednesdayValue(false)
        setTuesdayValue(false)
        setMondayValue(false)
    }
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
    const editItem = (item) => {
        if (item) {
            setIsBankModal(true);
            setIsUpdate(true);
            setTimeout(() => {
                formRef.current.resetFields();
                if (item.hasOwnProperty('insumos') && item.insumos) {
                    setInsumos(true)
                } else {
                    setInsumos(false)
                }
                if (item.monday) { setMondayValue(true) }
                else {
                    setMondayValue(false)
                }
                if (item.tuesday) setTuesdayValue(true)
                else {
                    setTuesdayValue(false)
                }
                if (item.wednesday) setWednesdayValue(true)
                else {
                    setWednesdayValue(false)
                }
                if (item.thursday) setTursdayValue(true)
                else {
                    setTursdayValue(false)
                }
                if (item.friday) setFridayValue(true)
                else {
                    setFridayValue(false)
                }
                if (item.saturday) setSaturdayValue(true)
                else {
                    setSaturdayValue(false)
                }
                if (item.sunday) setSundayValue(true)
                else {
                    setSundayValue(false)
                }

                item.monday = item.monday ? [moment(item.monday[0]), moment(item.monday[1])] : null;
                item.tuesday = item.tuesday ? [moment(item.tuesday[0]), moment(item.tuesday[1])] : null;
                item.wednesday = item.wednesday ? [moment(item.wednesday[0]), moment(item.wednesday[1])] : null;
                item.thursday = item.thursday ? [moment(item.thursday[0]), moment(item.thursday[1])] : null;
                item.friday = item.friday ? [moment(item.friday[0]), moment(item.friday[1])] : null;
                item.saturday = item.saturday ? [moment(item.saturday[0]), moment(item.saturday[1])] : null;
                item.sunday = item.sunday ? [moment(item.sunday[0]), moment(item.sunday[1])] : null;
                item.routes = item.routes ? item.routes._id : undefined;
                if (formRef.current) formRef.current.setFieldsValue(item);
                setCurrentId(item._id);
            }, 200);

        }
    }
    const deleteItem = (item) => {
        const id = item._id;


        const jsonData = { parent_id: currentEmployeeId }
        console.log(id, 'idididi')
        dispatch(crud.delete({ entity, id }))
        setTimeout(() => {
            dispatch(crud.listByCustomerStores({ entity, jsonData }));
        }, 500)
    }
    const handleBankModal = () => {
        setIsBankModal(false)
    }
    const saveBankDetails = (values) => {

        const parentId = currentEmployeeId;
        if (currentId && parentId && isUpdate) {
            const id = currentId;
            const jsonData = { parent_id: parentId }
            values["parent_id"] = parentId;
            dispatch(crud.update({ entity, id, jsonData: values }));
            setIsBankModal(false)
            setTimeout(() => {
                dispatch(crud.listByCustomerStores({ entity, jsonData }));
            }, 500)
        } else {
            const jsonData = { parent_id: parentId }
            const id = currentId;
            values["parent_id"] = parentId;
            dispatch(crud.create({ entity, id, jsonData: values }));
            setIsBankModal(false)
            setTimeout(() => {
                dispatch(crud.listByCustomerStores({ entity, jsonData }));
            }, 500)
        }
    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const { result: Items } = useSelector(selectListsByCustomerStores);
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
    useEffect(() => {

        async function init() {
        }
        init();
        const id = currentEmployeeId;
        const jsonData = { parent_id: id }
        dispatch(crud.listByCustomerStores({ entity, jsonData }));
    }, []);

    useEffect(() => {
        async function init() {
            const { result: assignedEmployees } = await request.list({ entity: "assignedEmployee" });
            const items = Items.items || [];
            items.sort(compare);
            items.map(item => {
                const { _id: store_id } = item
                item['employees_'] = [];
                assignedEmployees.map(obj => {
                    const { contract, employee, store } = obj
                    const { _id: store_id1 } = store;
                    if (store_id === store_id1) {
                        item['employees_'].push(obj)
                    }
                })
                item['employees'] = item['employees_'].length
            })

            console.log(items, assignedEmployees, 'assignedEmployees');

            setListItems(items)
        }

        init();

    }, [
        Items
    ])
    const [mondayValue, setMondayValue] = useState(null);
    const [tuesdayValue, setTuesdayValue] = useState(null);
    const [wednesdayValue, setWednesdayValue] = useState(null);
    const [tursdayValue, setTursdayValue] = useState(null);
    const [fridayValue, setFridayValue] = useState(null);
    const [saturdayValue, setSaturdayValue] = useState(null);
    const [sundayValue, setSundayValue] = useState(null);
    const [isProducts, setIsProducts] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [products, setProducts] = useState("");
    const handleProducts = () => {
        setIsProducts(false)
    }
    const cancelModal = () => {
        setIsModal(false)
    }
    const showProducts = (products) => {
        setIsProducts(true);
        setProducts(products || "")
    }

    return (

        <div className="whiteBox shadow">
            <Modal title="Products" visible={isProducts} onCancel={handleProducts} footer={null}>
                <h3>{products}</h3>
            </Modal>
            <Modal title="Employees" visible={isModal} onCancel={cancelModal} footer={null} width={1000}>
                <Table
                    columns={employeeColumns}
                    dataSource={employeeDatas || []}

                />
            </Modal>
            <Modal title="Create Form" visible={isBankModal} onCancel={handleBankModal} footer={null} width={1000}>
                <Form
                    ref={formRef}
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    onFinish={saveBankDetails}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >

                    <Row gutter={24}>
                        <Col span={13}>
                            <Form.Item
                                name="store"
                                label="Store Name"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="location"
                                label="Location"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="waze_location"
                                label="Waze Location"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="routes"
                                label="Routes"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <SelectAsync entity={'routes'} displayLabels={['routes']}></SelectAsync>
                            </Form.Item>
                            <Form.Item
                                name="billing"
                                label="Billing"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input type="number" readOnly style={{ background: 'lightgrey' }} />
                            </Form.Item>
                            <Form.Item
                                name="labour_billing"
                                label="Labour Billing"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber onChange={(e) => setLabourBilling(e)} type="number" />
                            </Form.Item>
                            <Form.Item
                                name="product_billing"
                                label="Product Billing"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber onChange={(e) => setProductBilling(e)} type="number" />
                            </Form.Item>
                            <Form.Item
                                name="other_billing"
                                label="Other Billing"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber onChange={(e) => setOtherBilling(e)} type="number" />
                            </Form.Item>
                            <Form.Item
                                name="monday"
                                label={<Checkbox checked={mondayValue} onChange={(e) => { e.target.checked ? setMondayValue(true) : setMondayValue(false) }}>Monday</Checkbox>}
                            // rules={[
                            //     {
                            //         required: true,
                            //     },
                            // ]}
                            >
                                {mondayValue &&

                                    <TimePicker.RangePicker format={"HH:mm"} />
                                }
                            </Form.Item>
                            <Form.Item
                                name="tuesday"
                                label={<Checkbox checked={tuesdayValue} onChange={(e) => { e.target.checked ? setTuesdayValue(true) : setTuesdayValue(false) }}>Tuesday</Checkbox>}
                            // rules={[
                            //     {
                            //         required: true,
                            //     },
                            // ]}
                            >
                                {tuesdayValue &&

                                    <TimePicker.RangePicker format={"HH:mm"} />
                                }
                            </Form.Item>
                            <Form.Item
                                name="wednesday"
                                label={<Checkbox checked={wednesdayValue} onChange={(e) => { e.target.checked ? setWednesdayValue(true) : setWednesdayValue(false) }}>Wednesday</Checkbox>}

                            // rules={[
                            //     {
                            //         required: true,
                            //     },
                            // ]}
                            >
                                {wednesdayValue &&

                                    <TimePicker.RangePicker format={"HH:mm"} />
                                }
                            </Form.Item>
                            <Form.Item
                                name="thursday"
                                label={<Checkbox checked={tursdayValue} onChange={(e) => { e.target.checked ? setTursdayValue(true) : setTursdayValue(false) }}>Thursday</Checkbox>}

                            // rules={[
                            //     {
                            //         required: true,
                            //     },
                            // ]}
                            >
                                {tursdayValue &&

                                    <TimePicker.RangePicker format={"HH:mm"} />
                                }
                            </Form.Item>
                            <Form.Item
                                name="friday"

                                label={<Checkbox checked={fridayValue} onChange={(e) => { e.target.checked ? setFridayValue(true) : setFridayValue(false) }}>Friday</Checkbox>}
                            // rules={[
                            //     {
                            //         required: true,
                            //     },
                            // ]}
                            >
                                {fridayValue &&

                                    <TimePicker.RangePicker format={"HH:mm"} />
                                }
                            </Form.Item>
                            <Form.Item
                                name="saturday"

                                label={<Checkbox checked={saturdayValue} onChange={(e) => { e.target.checked ? setSaturdayValue(true) : setSaturdayValue(false) }}>Saturday</Checkbox>}
                            // rules={[
                            //     {
                            //         required: true,
                            //     },
                            // ]}
                            >
                                {saturdayValue &&

                                    <TimePicker.RangePicker format={"HH:mm"} />
                                }
                            </Form.Item>
                            <Form.Item
                                name="sunday"

                                label={<Checkbox checked={sundayValue} onChange={(e) => { e.target.checked ? setSundayValue(true) : setSundayValue(false) }}>Sunday</Checkbox>}
                            // rules={[
                            //     {
                            //         required: true,
                            //     },
                            // ]}
                            >
                                {sundayValue &&

                                    <TimePicker.RangePicker format={"HH:mm"} />
                                }
                            </Form.Item>


                        </Col>
                        <Col span={11}>
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Radio.Group options={[

                                    {
                                        label: "Active",
                                        value: 0
                                    },

                                    {
                                        label: "Inactive",
                                        value: 1
                                    }
                                ]} />
                            </Form.Item>
                            <Form.Item
                                name="rest_hr"
                                label="Rest(Hr)"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber />
                            </Form.Item>
                            <Form.Item
                                name="hr_day"
                                label="Hr/Day"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber />
                            </Form.Item>
                            <Form.Item
                                name="days_week"
                                label="Days * week"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber />
                            </Form.Item>
                            <Form.Item
                                name="insumos"
                                label="Insumos"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Radio.Group
                                    options={[
                                        {
                                            value: true,
                                            label: "Yes"
                                        },
                                        {
                                            value: false,
                                            label: "No"
                                        },
                                    ]}

                                    onChange={(e) => { console.log(e.target.value); setInsumos(e.target.value) }}
                                />
                            </Form.Item>
                            {insumos &&
                                <>
                                    {/* <Form.Item
                                        name="visit_value"
                                        label="Visits"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <Input type='number' />
                                    </Form.Item> */}
                                    <Form.Item
                                        name="deliver"
                                        label="Monthly deliver"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <Input type='number' />
                                    </Form.Item>
                                </>
                            }
                            <Form.Item
                                name="inspection"
                                label="Monthly inspections"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber type="number" />
                            </Form.Item>
                            <Form.Item
                                name="products"
                                label="Products"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item
                                name="spec"
                                label="Specs"
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
                            isUpdate ?
                                <Button type="primary" htmlType="submit">
                                    Update
                                </Button>
                                : <Button type="primary" htmlType="submit">
                                    Save
                                </Button>

                        }

                        <Button type="ghost" onClick={handleBankModal}>
                            cancel
                        </Button>
                    </Form.Item>
                </Form>
                <>
                </>
            </Modal>
            <Row>
                <Col span={3}>
                    <h3 style={{ color: '#22075e', marginBottom: 5 }}>Stores</h3>
                </Col>
                <Col span={12}>
                    <Button type="primary" onClick={editBankModal}>Add</Button>
                </Col>
            </Row>
            <Table
                bordered
                rowKey={(item) => item._id}
                key={(item) => item._id}
                dataSource={listItems || []}
                columns={bankColumns}
                rowClassName="editable-row"


            />
        </div>
    );
}

export default CustomerStores;