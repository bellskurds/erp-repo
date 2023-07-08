import { crud } from "@/redux/crud/actions";
import { selectFilteredItemsByParent, selectListItems, selectListsByCustomerContact, selectListsByCustomerStores, selectListsBylistByCustomerStores, selectReadItem } from "@/redux/crud/selectors";
import { DeleteOutlined, EditOutlined, EyeOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Radio, Row, Select, Table, Tag, TimePicker, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import countryList from 'country-list'
import moment from "moment";


const CustomerStores = (props) => {
    const entity = 'customerStores';
    const dispatch = useDispatch();
    const currentEmployeeId = props.parentId
    const [isBankModal, setIsBankModal] = useState(false);
    const formRef = useRef(null);
    const [insumos, setInsumos] = useState(false);
    const bankColumns = [
        {
            title: 'Store',
            dataIndex: 'store',
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
            render: (text, record) => (
                <>
                    {record.location && countryLists.find(obj => obj.value === record.location).label}
                </>
            )
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

                    <>
                        <Typography.Link onClick={() => editItem(record)}>
                            <EditOutlined style={{ fontSize: "20px" }} />
                        </Typography.Link>

                        <Popconfirm title="Sure to delete?" onConfirm={() => deleteItem(record)}>
                            <DeleteOutlined style={{ fontSize: "20px" }} />
                        </Popconfirm>
                    </>
                )

            },
        },
    ];
    const [currentId, setCurrentId] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);

    const editBankModal = () => {
        setIsBankModal(true);
        setIsUpdate(false);
        // if (formRef) formRef.current.resetFields();
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
                console.log(item, 'fffffffffffffffffffsssffffff')
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

    useEffect(() => {
        const id = currentEmployeeId;
        const jsonData = { parent_id: id }
        // dispatch(crud.resetState());
        console.log(id, jsonData, '333333333334343433')
        dispatch(crud.listByCustomerStores({ entity, jsonData }));
    }, []);

    const items = Items.items || [];

    const compare = (a, b) => {
        if (a.primary && !b.primary) {
            return -1; // a comes before b
        } else if (!a.primary && b.primary) {
            return 1; // b comes before a
        } else {
            return 0; // no change in order
        }
    };
    items.sort(compare);
    // console.log(Items, '44444333')
    // const items = Items.items
    // const items = Items.items ? Items.items.filter(obj => obj.parent_id === currentEmployeeId) : [];

    const countryLists = countryList.getData().map((item) => ({
        value: item.code,
        label: item.name
    }))
    const [mondayValue, setMondayValue] = useState(null);
    const [tuesdayValue, setTuesdayValue] = useState(null);
    const [wednesdayValue, setWednesdayValue] = useState(null);
    const [tursdayValue, setTursdayValue] = useState(null);
    const [fridayValue, setFridayValue] = useState(null);
    const [saturdayValue, setSaturdayValue] = useState(null);
    const [sundayValue, setSundayValue] = useState(null);
    const [timeRange, setTimeRange] = useState([]);
    const [isProducts, setIsProducts] = useState(false);
    const [products, setProducts] = useState("");
    const handleProducts = () => {
        setIsProducts(false)
    }
    const showProducts = (products) => {
        setIsProducts(true);
        setProducts(products || "")
    }
    useEffect(() => {
        console.log(timeRange, '--------------------')
    }, [timeRange])
    // const items = []
    // console.log(bankItems, 'ItemsItemsItemsItemsItems')
    useEffect(() => {
        console.log(insumos, '3333');
    }, [insumos])
    return (

        <div className="whiteBox shadow">
            <Modal title="Products" visible={isProducts} onCancel={handleProducts} footer={null}>
                <h3>{products}</h3>
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
                    initialValues={{
                        gender: 1,
                        civil_status: 3,
                        birthplace: "AU",

                    }}
                >

                    <Row gutter={24}>
                        <Col span={15}>
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
                                <Select
                                    showSearch
                                    placeholder="Select a person"
                                    optionFilterProp="children"
                                    // onChange={onChange}
                                    // onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={countryLists}
                                />
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
                                <InputNumber />
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
                        <Col span={9}>
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
                                <Form.Item
                                    name="visit_value"
                                    label="Visits"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input type='number' />
                                </Form.Item>
                            }

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
                dataSource={items || []}
                columns={bankColumns}
                rowClassName="editable-row"


            />
        </div>
    );
}

export default CustomerStores;