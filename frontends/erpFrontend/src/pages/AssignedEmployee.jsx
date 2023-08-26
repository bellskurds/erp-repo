import { crud } from "@/redux/crud/actions";
import { selectListsByAssignedEmployee, selectListsByContract, selectListsByCustomerStores, } from "@/redux/crud/selectors";
import { DeleteOutlined, EditOutlined, } from "@ant-design/icons";
import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Popconfirm, Row, Select, Table, TimePicker, Typography, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectAsync from "@/components/SelectAsync";
import moment from "moment";
const contractTypes = [
    "",
    "Payroll",
    "Services",
    "Viaticum",
    "Hourly"
]
const { role } = window.localStorage.auth ? JSON.parse(window.localStorage.auth) : {};

const AssignedEmployee = (props) => {
    const entity = 'assignedEmployee';
    const dispatch = useDispatch();
    const currentEmployeeId = props.parentId
    const [isBankModal, setIsBankModal] = useState(false);
    const formRef = useRef(null);
    const [itemLists, setItemLists] = useState([]);
    const [currentEmployee, setCurrentEmployee] = useState(false);
    const [currentContract, setCurrentContract] = useState(false);
    const [currentViaticum, setCurrentViaticum] = useState(false);
    const [assignStatus, setAssignStatus] = useState(true);
    const [unAssignStatus, setUnAssignStatus] = useState(false);
    const positionColumns = [
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
            render: (text, record) => {
                const { viaticum, contract } = record;
                if (viaticum && contract) {
                    return `${contractTypes[text]},${contractTypes[viaticum.type]}`
                } else if (contract) {
                    return `${contractTypes[text]}`
                } else if (viaticum) {
                    return `${contractTypes[viaticum.type]}`
                }
            }
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
                            {record.position &&

                                <Popconfirm title="Sure to delete?" onConfirm={() => deleteItem(record)}>
                                    <DeleteOutlined style={{ fontSize: "20px" }} />
                                </Popconfirm>
                            }
                        </> : ''
                )

            },
        },
    ];
    const [currentId, setCurrentId] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);
    const [currentItem, selectCurrentItem] = useState();
    const editBankModal = () => {
        setIsBankModal(true);
        setIsUpdate(false);
        setIsEmployee(false)
        setMondayValue(false);
        setTuesdayValue(false);
        setWednesdayValue(false);
        setTursdayValue(false);
        setFridayValue(false);
        setSaturdayValue(false);
        setSundayValue(false);
        setUnAssignStatus(false);
        setAssignStatus(true);
        setCantUpdate(false);
        setIsViaticum(false);
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
    const [cantUpdate, setCantUpdate] = useState(false);
    const editItem = (item) => {
        if (item) {
            console.log(item, 'item');

            setIsEmployee(false)
            setIsBankModal(true);
            setIsUpdate(true);
            setCurrentContract(item.contract);
            setCurrentEmployee(item.employee);
            setCurrentViaticum(item.viaticum);
            selectCurrentItem(item);
            setUnAssignStatus(false);
            setIsViaticum(false)
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
                if (item.end_date) {
                    setUnAssignStatus(true);
                    setCantUpdate(true);
                } else {
                    setUnAssignStatus(false);
                    setCantUpdate(false);
                }
                if (item.viaticum_start_date) {
                    setIsViaticum(true)
                } else {
                    setIsViaticum(false)
                }
                if (!item.viaticum) {
                    setIsViaticum(false)
                } else if (!item.employee) {
                    setIsEmployee(false)
                }
                if (item.contract) {
                    setIsContract(true)
                } else {
                    setIsContract(false)
                }
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
                    position: item.position,
                    gross_salary: item.gross_salary,
                    start_date: item.start_date ? moment(new Date(item.start_date)) : null,
                    viaticum_start_date: item.viaticum_start_date ? moment(new Date(item.viaticum_start_date)) : null,
                    viaticum_end_date: item.viaticum_end_date ? moment(new Date(item.viaticum_end_date)) : null,
                    end_date: item.end_date ? moment(new Date(item.end_date)) : null,
                });

                setTimeout(() => {
                    formRef.current.setFieldsValue({
                        contract: item.contract ? item.contract._id : undefined,
                        viaticum: item.viaticum ? item.viaticum._id : undefined
                    })
                }, 200);
                setCurrentId(item._id);
            }, 200);

        }
    }
    const deleteItem = (item) => {
        const id = item._id;


        const jsonData = { parent_id: currentEmployeeId }
        console.log(id, 'idididi')

        setItemLists(itemLists.filter(item => item._id !== id))
        dispatch(crud.delete({ entity, id }))
        setTimeout(() => {
            dispatch(crud.listByAssignedEmployee({ entity, jsonData }));
        }, 500)
    }
    const handleModal = () => {
        setIsBankModal(false)
    }
    const saveDetails = (values) => {

        const parentId = currentEmployeeId;
        if (unAssignStatus && currentId && parentId && isUpdate) {

            const id = currentId;
            values["parent_id"] = parentId;
            const jsonData = { parent_id: parentId }
            const { start_date, ...updateObj } = values
            dispatch(crud.update({ entity, id, jsonData: { ...updateObj, unassigned: true } }));


            setTimeout(() => {
                const { contract, viaticum, employee, start_date, end_date, viaticum_start_date, viaticum_end_date, ...otherObj } = values
                dispatch(crud.create({ entity, jsonData: otherObj }));
                setIsBankModal(false)
                dispatch(crud.listByAssignedEmployee({ entity, jsonData }));
            }, 500)

        }
        else if (currentId && parentId && isUpdate) {
            const id = currentId;
            const jsonData = { parent_id: parentId }
            values["parent_id"] = parentId;
            dispatch(crud.update({ entity, id, jsonData: values }));
            setIsBankModal(false)
            setTimeout(() => {
                dispatch(crud.listByAssignedEmployee({ entity, jsonData }));
            }, 500)
        }

        else {
            const jsonData = { parent_id: parentId }
            values["parent_id"] = parentId;
            dispatch(crud.create({ entity, jsonData: values }));
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
    useEffect(() => {
        const positions = Items.items || [];
        const data = positions.filter(position => !position.unassigned)
        setItemLists(data || [])
        console.log(Items.items, 'Items.items');
    }, [Items])

    const [mondayValue, setMondayValue] = useState(null);
    const [tuesdayValue, setTuesdayValue] = useState(null);
    const [wednesdayValue, setWednesdayValue] = useState(null);
    const [tursdayValue, setTursdayValue] = useState(null);
    const [fridayValue, setFridayValue] = useState(null);
    const [saturdayValue, setSaturdayValue] = useState(null);
    const [sundayValue, setSundayValue] = useState(null);

    const [workContract, setWorkContract] = useState([]);
    const [viaticumContract, setViaticumContract] = useState([]);
    const [stores, setStores] = useState([]);
    const { result: Contracts } = useSelector(selectListsByContract);
    const [isEmployee, setIsEmployee] = useState(false);
    const [isViaticum, setIsViaticum] = useState(false);
    const [isContract, setIsContract] = useState(false);
    const [workContracts, setWorkContracts] = useState();
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(false);
    const changeEmployee = (value) => {
        formRef.current.setFieldsValue({
            contract: undefined,
            viaticum: undefined,
        })
        if (value) {
            setSelectedEmployeeId(value)
            setIsEmployee(true)
            const entity = 'workContract';
            const jsonData = { parent_id: value }
            // dispatch(crud.resetState());
            dispatch(crud.listByContract({ entity, jsonData }));
        } else {
            setIsEmployee(false)
        }
    }
    const changeViaticum = (e) => {
        console.log(e, 'test');
        if (e) {
            setIsViaticum(true)
        } else {
            setIsViaticum(false)
        }
    }
    const changeContract = (e) => {
        console.log(currentItem, 'currentItem')
        setUnAssignStatus(false);

        if (currentItem) {
            if (currentItem.end_date) {
                setUnAssignStatus(true);
                setCantUpdate(true);
            } else {
                setUnAssignStatus(false);
                setCantUpdate(false);
            }
            if (currentItem.viaticum_start_date) {
                setIsViaticum(true)
            } else {
                setIsViaticum(false)
            }
            if (currentItem.contract && currentItem.contract._id === e) {
                if (formRef.current) {
                    formRef.current.setFieldsValue({
                        start_date: currentItem.start_date ? moment(new Date(currentItem.start_date)) : null,
                        end_date: currentItem.end_date ? moment(new Date(currentItem.end_date)) : null,
                        viaticum_start_date: currentItem.viaticum_start_date ? moment(new Date(currentItem.viaticum_start_date)) : null,
                        viaticum_end_date: currentItem.viaticum_end_date ? moment(new Date(currentItem.viaticum_end_date)) : null,

                    })
                }
            } else {
                if (formRef.current) {
                    formRef.current.resetFields(["start_date"])
                }
            }
        }
        if (e) {
            setIsContract(true)
        } else {
            setIsContract(false)
        }
    }
    useEffect(() => {
        if (Contracts)
            setWorkContracts(Contracts.items)
    }, [
        Contracts
    ])
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

    }, [Stores]);

    useEffect(() => {

        console.log(selectedEmployeeId, 'selectedEmployeeId');
    }, [selectedEmployeeId,])
    useEffect(() => {
        console.log(Contracts, 'ContractsContracts')
        const contractOptions = Contracts.items || [];
        if (contractOptions) {
            const contracts = contractOptions.map(item => {
                if (item.status === "active" && item.type < 3) {
                    return {
                        value: item._id,
                        label: `${contractTypes[item.type]} Sal/hr ${item.sal_hr} | Sal/Mon ${item.sal_monthly}`
                    }
                } else if (item.status === "active" && item.type === 4) {
                    return {
                        value: item._id,
                        label: `${contractTypes[item.type]} Sal/hr ${item.sal_hr}`
                    }
                } else {
                    return {}
                }
            })
            const _viaticumContract = contractOptions.map(item => {
                if (item.status === "active" && item.type === 3) {
                    return {
                        value: item._id,
                        label: `${contractTypes[item.type]} | Sal/Mon ${item.sal_monthly}`
                    }
                } else {
                    return {}
                }
            })
            setWorkContract(contracts);
            setViaticumContract(_viaticumContract);

        } else {
            setWorkContract(undefined);
            setViaticumContract(undefined);
        }

    }, [Contracts]);
    useEffect(() => {

        console.log(currentContract, currentEmployee, currentViaticum, 'currentContract , currentEmployee')
        if ((currentContract && currentEmployee) || (currentViaticum && currentEmployee)) {
            setAssignStatus(false);
        } else {

            console.log()
            setAssignStatus(true);
        }
    }, [currentContract, currentEmployee, currentViaticum]);



    useEffect(() => {

        console.log(isContract, isEmployee, 'isContract,isEmployee');
    }, [isContract, isEmployee])
    const [isWorkDate, setIsWorkDate] = useState(false);
    const cancelWorkDate = () => {
        setIsWorkDate(false);
    }
    const handleUnAssign = () => {
        setUnAssignStatus(true);
    }
    const handleLastWork = (values) => {

        console.log(values, currentItem, 'values, currentItem')
    }
    const checkValidate = (e, type) => {
        if (formRef.current) {
            const { contract, viaticum } = formRef.current.getFieldsValue(['contract', 'viaticum'])

            const currentWorkContract = workContracts.filter(data => contract === data._id);
            const currentViaticum = workContracts.filter(data => viaticum === data._id);

            let { start_date: contractStart, end_date: contractEnd } = currentWorkContract[0] || { start_date: new Date('01-01-1999'), end_date: new Date('01-01-2999') };
            let { start_date: viaticumStart, end_date: viaticumEnd } = currentViaticum[0] || { start_date: new Date('01-01-1999'), end_date: new Date('01-01-2999') };
            contractStart = moment(contractStart, 'MM-DD-YYYY');
            viaticumStart = moment(viaticumStart, 'MM-DD-YYYY');
            contractEnd = moment(contractEnd, 'MM-DD-YYYY');
            viaticumEnd = moment(viaticumEnd, 'MM-DD-YYYY');
            let selectedDate = moment(e, 'MM-DD-YYYY');
            if (type === 'contract') {
                if (selectedDate.isSameOrBefore(contractStart) || !selectedDate.isSameOrBefore(contractEnd)) {
                    formRef.current.resetFields(['start_date']);
                    message.error("position start date cant be before employee contract start date")
                }
            } else {
                if (selectedDate.isSameOrBefore(viaticumStart) || !selectedDate.isSameOrBefore(viaticumEnd)) {
                    formRef.current.resetFields(['viaticum_start_date']);
                    message.error("position start date cant be before employee viaticum start date")
                }
            }
        }
    }
    const endValidate = (e, type) => {
        if (formRef.current) {
            const { contract, viaticum } = formRef.current.getFieldsValue(['contract', 'viaticum'])
            const currentWorkContract = workContracts.filter(data => contract === data._id);
            const currentViaticum = workContracts.filter(data => viaticum === data._id);
            let { end_date: contractEnd } = currentWorkContract[0] || { start_date: new Date('01-01-1999'), end_date: new Date('01-01-2999') };
            let { end_date: viaticumEnd } = currentViaticum[0] || { start_date: new Date('01-01-1999'), end_date: new Date('01-01-2999') };
            contractEnd = moment(contractEnd, 'MM-DD-YYYY');
            viaticumEnd = moment(viaticumEnd, 'MM-DD-YYYY');
            let selectedDate = moment(e, 'MM-DD-YYYY');
            if (formRef.current) {
                let { start_date, viaticum_start_date } = formRef.current.getFieldsValue();
                let startDate = moment(start_date, 'MM-DD-YYYY');
                if (type === "viaticum") {
                    startDate = moment(viaticum_start_date, 'MM-DD-YYYY');
                }
                if (selectedDate.isAfter(startDate)) {
                    console.log('yes');
                    if (type === 'contract') {

                        if (!(selectedDate.format("MM/DD/YYYY") === contractEnd.format("MM/DD/YYYY") || selectedDate.isSameOrBefore(contractEnd))) {
                            formRef.current.resetFields(['end_date']);
                            message.error("position end date cant be before employee contract end date")
                        }
                    } else {
                        if (!(selectedDate.format("MM/DD/YYYY") === viaticumEnd.format("MM/DD/YYYY") || selectedDate.isBefore(viaticumEnd))) {
                            formRef.current.resetFields(['viaticum_end_date']);
                            message.error("position end date cant be before employee viaticum_end_date end date")
                        }
                    }
                } else {
                    if (type === 'contract') {
                        formRef.current.resetFields(['end_date']);
                        message.error('should be after than start date')
                    } else {
                        formRef.current.resetFields(['viaticum_end_date']);
                        message.error('should be after than start date')
                    }
                }
            }
        }
    }
    return (

        <div className="whiteBox shadow">
            <Modal title="Create Form" visible={isBankModal} onCancel={handleModal} footer={null} width={1000}>
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
                                    onChange={changeContract}
                                />
                            </Form.Item>
                            <Form.Item
                                name="viaticum"
                                label="Viaticum"
                            >
                                <Select
                                    showSearch
                                    placeholder="Select a contract"
                                    optionFilterProp="children"
                                    // onChange={onChange}
                                    // onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={viaticumContract}
                                    onChange={changeViaticum}
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
                            {(isEmployee && isContract) && <Form.Item
                                name={"start_date"}
                                label="Start Date"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <DatePicker onChange={(e) => checkValidate(e, 'contract')} />
                            </Form.Item>}
                            {isViaticum && <Form.Item
                                name={"viaticum_start_date"}
                                label="Viaticum Start"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <DatePicker onChange={(e) => checkValidate(e, 'viaticum')} />
                            </Form.Item>}

                            {
                                unAssignStatus &&

                                <>

                                    {(isEmployee && isContract) && <Form.Item
                                        name={"end_date"}
                                        label="Last Date"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <DatePicker onChange={(e) => endValidate(e, 'contract')} />
                                    </Form.Item>}
                                    {(isEmployee && isViaticum) &&
                                        <Form.Item
                                            name={"viaticum_end_date"}
                                            label="Viaticum Last"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <DatePicker onChange={(e) => endValidate(e, 'viaticum')} />
                                        </Form.Item>}
                                </>
                            }
                            {!assignStatus &&

                                <Form.Item
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                >
                                    <Button type="ghost" onClick={handleUnAssign}>
                                        UnAssign
                                    </Button>
                                </Form.Item>
                            }
                        </Col>
                    </Row>
                    {/* {
                        !cantUpdate &&
                    } */}
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
                    {/* {

                        cantUpdate &&
                        <Form.Item>

                            <label style={{ fontSize: '30px', textAlign: 'right', color: 'red' }}>You can't update because it was un assigned</label>
                        </Form.Item>
                    } */}
                </Form>
                <>
                </>
            </Modal>
            <Modal title="Last day worked" visible={isWorkDate} footer={false}>
                <Form onFinish={handleLastWork}>

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

                        <Button type="ghost" onClick={cancelWorkDate}>
                            cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Row>
                <Col span={3}>
                    <h3 style={{ color: '#22075e', marginBottom: 5 }}>Positions</h3>
                </Col>
                <Col span={12}>
                    <Button type="primary" onClick={editBankModal}>Create</Button>
                </Col>
            </Row>
            <Table
                bordered
                rowKey={(item) => item._id}
                key={(item) => item._id}
                dataSource={itemLists || []}
                columns={positionColumns}
                rowClassName="editable-row"


            />
        </div>
    );
}

export default AssignedEmployee;