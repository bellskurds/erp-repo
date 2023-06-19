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
    const bankColumns = [
        {
            title: 'Store',
            dataIndex: 'store',
        },
        {
            title: 'Hours',
            dataIndex: 'hours',
        },

        {
            title: 'Hr/sem',
            dataIndex: 'hr_week',
        },
        {
            title: 'Location',
            dataIndex: 'location',
        },
        {
            title: 'Billing',
            dataIndex: 'billing',
        },
        {
            title: 'Products',
            dataIndex: 'product',
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
            const [start, end] = days[i];

            if (start === end) {
                hours.push(dayLabels[i] + ' ' + start);
            } else if (i === 0 || start !== days[i - 1][0] || end !== days[i - 1][1]) {
                hours.push(dayLabels[i] + ' ' + start + '-' + end);
            }
        }
        return hours.join(', ');
    }

    const days = [
        ['11.10', '20.10'],
        ['5am', '10pm'],
        ['5am', '10pm'],
        ['5am', '13pm'],
        ['5am', '14pm'],
        ['5am', '14pm'],
        ['5am', '13pm']
    ];
    const formattedHours = getFormattedHours(days);
    console.log(formattedHours, 'formattedHoursformattedHours');
    const editItem = (item) => {
        if (item) {
            setIsBankModal(true);
            setIsUpdate(true);
            setTimeout(() => {
                item.monday = moment(item.monday) || null;
                item.tuesday = moment(item.tuesday) || null;
                item.wednesday = moment(item.wednesday) || null;
                item.thursday = moment(item.thursday) || null;
                item.friday = moment(item.friday) || null;
                item.saturday = moment(item.saturday) || null;
                item.sunday = moment(item.sunday) || null;

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

        // console.log(values, '33333333333333333333');

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
    const setPrimary = (record) => {
        const id = record._id;
        const jsonData = { primary: true }
        const entity = 'customerContacts'
        dispatch(crud.update({ entity, id, jsonData }));
        setTimeout(() => {
            const jsonData = { parent_id: currentEmployeeId }
            dispatch(crud.listByCustomerStores({ entity, jsonData }))
        }, [500])
    }

    const { result: Items } = useSelector(selectListsByCustomerStores);

    useEffect(() => {
        const id = currentEmployeeId;
        const jsonData = { parent_id: id }
        // dispatch(crud.resetState());
        console.log(id, jsonData, '333333333333')
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


    useEffect(() => {
        console.log(timeRange, '--------------------')
    }, [timeRange])
    // const items = []
    // console.log(bankItems, 'ItemsItemsItemsItemsItems')
    return (

        <div className="whiteBox shadow">
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
                                label={<Checkbox onChange={(e) => { e.target.checked ? setMondayValue(true) : setMondayValue(false) }}>Monday</Checkbox>}
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
                                label={<Checkbox onChange={(e) => { e.target.checked ? setTuesdayValue(true) : setTuesdayValue(false) }}>Tuesday</Checkbox>}
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
                                label={<Checkbox onChange={(e) => { e.target.checked ? setWednesdayValue(true) : setWednesdayValue(false) }}>Wednesday</Checkbox>}

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
                                label={<Checkbox onChange={(e) => { e.target.checked ? setTursdayValue(true) : setTursdayValue(false) }}>Thursday</Checkbox>}

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

                                label={<Checkbox onChange={(e) => { e.target.checked ? setFridayValue(true) : setFridayValue(false) }}>Friday</Checkbox>}
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

                                label={<Checkbox onChange={(e) => { e.target.checked ? setSaturdayValue(true) : setSaturdayValue(false) }}>Saturday</Checkbox>}
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

                                label={<Checkbox onChange={(e) => { e.target.checked ? setSundayValue(true) : setSundayValue(false) }}>Sunday</Checkbox>}
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