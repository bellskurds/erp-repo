import { crud } from "@/redux/crud/actions";
import { selectFilteredItemsByParent, selectListItems, selectListsByAssignedEmployee, selectListsByContract, selectListsByCustomerContact, selectListsByCustomerStores, selectListsBylistByAssignedEmployee, selectReadItem } from "@/redux/crud/selectors";
import { DeleteOutlined, EditOutlined, EyeOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Popconfirm, Radio, Row, Select, Table, Tag, TimePicker, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import countryList from 'country-list'
import SelectAsync from "@/components/SelectAsync";


const AssignedEmployee = (props) => {
    const entity = 'assignedEmployee';
    const dispatch = useDispatch();
    const currentEmployeeId = props.parentId
    const [isBankModal, setIsBankModal] = useState(false);
    const formRef = useRef(null);
    const bankColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Branch',
            dataIndex: 'branch',
        },

        {
            title: 'Time',
            dataIndex: 'time',
        },
        {
            title: 'Hr/Week',
            dataIndex: 'hr_week',
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Sal/Hr',
            dataIndex: 'sal_hr',
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
    const editItem = (item) => {
        if (item) {
            setIsBankModal(true);
            setIsUpdate(true);
            setTimeout(() => {

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
            dispatch(crud.listByAssignedEmployee({ entity, jsonData }));
        }, 500)
    }
    const handleBankModal = () => {
        setIsBankModal(false)
    }
    const saveBankDetails = (values) => {
        console.log(values, '33333333333333333333');

        const parentId = currentEmployeeId;
        if (currentId && parentId && isUpdate) {
            const id = currentId;
            const jsonData = { parent_id: parentId }
            values["parent_id"] = parentId;
            dispatch(crud.update({ entity, id, jsonData: values }));
            setIsBankModal(false)
            setTimeout(() => {
                dispatch(crud.listByAssignedEmployee({ entity, jsonData }));
            }, 500)
        } else {
            const jsonData = { parent_id: parentId }
            const id = currentId;
            values["parent_id"] = parentId;
            dispatch(crud.create({ entity, id, jsonData: values }));
            setIsBankModal(false)
            setTimeout(() => {
                dispatch(crud.listByAssignedEmployee({ entity, jsonData }));
            }, 500)
        }
    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const { result: Items } = useSelector(selectListsByAssignedEmployee);

    useEffect(() => {
        const id = currentEmployeeId;
        const jsonData = { parent_id: id }
        // dispatch(crud.resetState());
        console.log(id, jsonData, '333333333333')
        dispatch(crud.listByAssignedEmployee({ entity, jsonData }));
    }, []);

    const items = Items.items || [];

    // const compare = (a, b) => {
    //     if (a.primary && !b.primary) {
    //         return -1; // a comes before b
    //     } else if (!a.primary && b.primary) {
    //         return 1; // b comes before a
    //     } else {
    //         return 0; // no change in order
    //     }
    // };
    // items.sort(compare);
    // console.log(Items, '44444333')
    // const items = Items.items
    // const items = Items.items ? Items.items.filter(obj => obj.parent_id === currentEmployeeId) : [];


    const [mondayValue, setMondayValue] = useState(null);
    const [tuesdayValue, setTuesdayValue] = useState(null);
    const [wednesdayValue, setWednesdayValue] = useState(null);
    const [tursdayValue, setTursdayValue] = useState(null);
    const [fridayValue, setFridayValue] = useState(null);
    const [saturdayValue, setSaturdayValue] = useState(null);
    const [sundayValue, setSundayValue] = useState(null);

    const [workContract, setWorkContract] = useState([]);
    const { result: Contracts } = useSelector(selectListsByContract);

    const changeEmployee = (value) => {

        console.log(value, 'value------------')
        formRef.current.setFieldsValue({
            contract: undefined
        })
        setWorkContract([])
        if (value) {
            const entity = 'workContract';
            const jsonData = { parent_id: value }
            // dispatch(crud.resetState());
            dispatch(crud.listByContract({ entity, jsonData }))
        }
    }
    useEffect(() => {

        console.log(Contracts, 'ContractsContracts')
        const contractOptions = Contracts.items || [];
        if (contractOptions) {
            const contracts = contractOptions.map(item => {
                if (item.status === "active") {
                    return {
                        value: item._id,
                        label: `${item.start_date}~${item.end_date}`
                    }
                } else {
                    return {}
                }
            })
            setWorkContract(contracts);
        } else {

            console.log('12222222222222222222')
            setWorkContract(undefined);
        }

    }, [Contracts])
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
                                name="employee"
                                label="Employee"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <SelectAsync onChange={changeEmployee} entity={'employee'} displayLabels={['name']}></SelectAsync>

                            </Form.Item>
                            <Form.Item
                                name="contract"
                                label="Contract"
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
                                    options={workContract}
                                />
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
                                name="store"
                                label="Store"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <SelectAsync entity={'customerStores'} displayLabels={['store']}></SelectAsync>
                            </Form.Item>
                            <Form.Item
                                name="sal_hr"
                                label="Sal/Hr"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber />
                            </Form.Item>
                            <Form.Item
                                name="hr_week"
                                label="Hr/sem"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber />
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
                    <h3 style={{ color: '#22075e', marginBottom: 5 }}>Assigned Employees</h3>
                </Col>
                <Col span={12}>
                    <Button type="primary" onClick={editBankModal}>Assign</Button>
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

export default AssignedEmployee;