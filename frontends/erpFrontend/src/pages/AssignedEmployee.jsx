import { crud } from "@/redux/crud/actions";
import { selectListsByAssignedEmployee, selectListsByContract, selectListsByCustomerStores, } from "@/redux/crud/selectors";
import { DeleteOutlined, EditOutlined, } from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Table, TimePicker, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectAsync from "@/components/SelectAsync";
import moment from "moment";

const { role } = window.localStorage.auth ? JSON.parse(window.localStorage.auth) : {};

const AssignedEmployee = (props) => {
    const entity = 'assignedEmployee';
    const dispatch = useDispatch();
    const currentEmployeeId = props.parentId
    const [isBankModal, setIsBankModal] = useState(false);
    const formRef = useRef(null);

    const contractType = ["", "Payroll", "Services"];
    const bankColumns = [
        {
            title: 'Position',
            dataIndex: 'position',
        },
        {
            title: 'Name',
            dataIndex: ['employee', 'name'],
        },
        {
            title: 'Branch',
            dataIndex: ['store', 'store'],
        },

        {
            title: 'Time',
            dataIndex: 'time',
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
            title: 'Hr/Week',
            dataIndex: 'hr_week',
        },
        {
            title: 'Type',
            dataIndex: ['contract', 'type'],
            render: (text, record) => (
                <>
                    {contractType[text]}
                </>
            )
        },
        {
            title: 'Sal/Hr',
            dataIndex: 'sal_hr',
        },
        {
            title: 'Gross Salary',
            dataIndex: 'gross_salary',
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
    const [currentId, setCurrentId] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);

    const editBankModal = () => {
        setIsBankModal(true);
        setIsUpdate(false);

        setMondayValue(false);
        setTuesdayValue(false);
        setWednesdayValue(false);
        setTursdayValue(false);
        setFridayValue(false);
        setSaturdayValue(false);
        setSundayValue(false);
        if (formRef.current) { formRef.current.resetFields(); }
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
    const editItem = (item) => {
        if (item) {
            setIsBankModal(true);
            setIsUpdate(true);
            if (formRef.current) formRef.current.resetFields();
            setTimeout(() => {
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

                console.log(item, 'fffffffffffffffffffsssffffff')
                if (formRef.current) formRef.current.setFieldsValue({
                    monday: item.monday ? [moment(item.monday[0]), moment(item.monday[1])] : null,
                    tuesday: item.tuesday ? [moment(item.tuesday[0]), moment(item.tuesday[1])] : null,
                    wednesday: item.wednesday ? [moment(item.wednesday[0]), moment(item.wednesday[1])] : null,
                    thursday: item.thursday ? [moment(item.thursday[0]), moment(item.thursday[1])] : null,
                    friday: item.friday ? [moment(item.friday[0]), moment(item.friday[1])] : null,
                    saturday: item.saturday ? [moment(item.saturday[0]), moment(item.saturday[1])] : null,
                    sunday: item.sunday ? [moment(item.sunday[0]), moment(item.sunday[1])] : null,
                    employee: item.employee,
                    store: item.store._id,
                    sal_hr: item.sal_hr,
                    hr_week: item.hr_week,
                    contract: item.contract._id,
                    position: item.position,
                    gross_salary: item.gross_salary
                });
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
    const { result: Stores } = useSelector(selectListsByCustomerStores);

    useEffect(() => {
        const id = currentEmployeeId;
        const jsonData = { parent_id: id }
        dispatch(crud.listByAssignedEmployee({ entity, jsonData }));
        dispatch(crud.listByCustomerStores({ entity: "customerStores", jsonData: { parent_id: currentEmployeeId } }))
    }, []);

    const items = Items.items || [];

    const [mondayValue, setMondayValue] = useState(null);
    const [tuesdayValue, setTuesdayValue] = useState(null);
    const [wednesdayValue, setWednesdayValue] = useState(null);
    const [tursdayValue, setTursdayValue] = useState(null);
    const [fridayValue, setFridayValue] = useState(null);
    const [saturdayValue, setSaturdayValue] = useState(null);
    const [sundayValue, setSundayValue] = useState(null);

    const [workContract, setWorkContract] = useState([]);
    const [stores, setStores] = useState([]);
    const { result: Contracts } = useSelector(selectListsByContract);

    const changeEmployee = (value) => {
        formRef.current.setFieldsValue({
            contract: undefined
        })
        setWorkContract([])
        if (value) {
            const entity = 'workContract';
            const jsonData = { parent_id: value }
            // dispatch(crud.resetState());
            dispatch(crud.listByContract({ entity, jsonData }));

        }
    }

    useEffect(() => {
        const storesOptions = Stores.items || [];

        if (storesOptions) {
            const stores = storesOptions.map(item => {
                return {
                    value: item._id,
                    label: item.store
                }
            })
            setStores(stores);
        } else {
            setStores([]);
        }

    }, [Stores])
    useEffect(() => {

        console.log(Contracts, 'ContractsContracts')
        const contractOptions = Contracts.items || [];
        if (contractOptions) {
            const contracts = contractOptions.map(item => {
                if (item.status === "active") {
                    return {
                        value: item._id,
                        label: `${item.sal_hr}~${item.sal_monthly}`
                    }
                } else {
                    return {}
                }
            })
            setWorkContract(contracts);
        } else {
            setWorkContract(undefined);
        }

    }, [Contracts])
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
                                name={"position"}
                                label="Position"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="employee"
                                label="Employee"
                            // rules={[
                            //     {
                            //         required: true,
                            //     },
                            // ]}
                            >
                                <SelectAsync onChange={changeEmployee} entity={'employee'} displayLabels={['name']}></SelectAsync>

                            </Form.Item>
                            <Form.Item
                                name="contract"
                                label="Contract"
                            // rules={[
                            //     {
                            //         required: true,
                            //     },
                            // ]}
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
                                name="store"
                                label="Store"
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
                                    options={stores}
                                />
                                {/* <SelectAsync entity={'customerStores'} displayLabels={['store']}></SelectAsync> */}
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
                                <Input type='number' />
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
                                <Input type='number' />
                            </Form.Item>
                            <Form.Item
                                name="gross_salary"
                                label="Gross Salary"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input type='number' />
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
                    <h3 style={{ color: '#22075e', marginBottom: 5 }}>Positions</h3>
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