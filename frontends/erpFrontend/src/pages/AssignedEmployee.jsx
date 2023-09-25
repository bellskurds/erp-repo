/* eslint-disable no-unused-expressions */
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
                    {
                        setHourLabels(record)
                    }
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
        setThursdayValue(false);
        setFridayValue(false);
        setSaturdayValue(false);
        setSundayValue(false);
        setUnAssignStatus(false);
        setAssignStatus(true);
        setCantUpdate(false);
        setIsViaticum(false);

        setMondayNotWorking(false);
        setTuesdayNotWorking(false)
        setWednesdayNotWorking(false)
        setThursdayNotWorking(false)
        setFridayNotWorking(false)
        setSaturdayNotWorking(false)
        setSundayNotWorking(true)

        setMondayHour(0)
        setTuesdayHour(0)
        setWednesdayHour(0)
        setThursdayHour(0)
        setFridayHour(0)
        setSaturdayHour(0)
        setSundayHour(0)



        if (formRef.current) { formRef.current.resetFields(); }
    }
    const setHourLabels = (record) => {
        // const { is_custom_monday, is_custom_tuesday, is_custom_wednesday, is_custom_thursday, is_custom_friday, is_custom_saturday, is_custom_sunday } = record
        // console.log(is_custom_monday, is_custom_tuesday, is_custom_wednesday, is_custom_thursday, is_custom_friday, is_custom_saturday, is_custom_sunday);

        // if (is_custom_tuesday) record.tuesday = record.every_hours
        return getFormattedHours(
            [
                record.monday ? [record.monday[0], record.monday[1]] : "",
                record.tuesday ? [record.tuesday[0], record.tuesday[1]] : "",
                record.wednesday ? [record.wednesday[0], record.wednesday[1]] : "",
                record.thursday ? [record.thursday[0], record.thursday[1]] : "",
                record.friday ? [record.friday[0], record.friday[1]] : "",
                record.saturday ? [record.saturday[0], record.saturday[1]] : "",
                record.sunday ? [record.sunday[0], record.sunday[1]] : "",
            ]
        )
    }
    const getFormattedHours = (days) => {

        const dayLabels = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];
        const hours = [];

        for (let i = 0; i < days.length; i++) {
            if (!days[i]) continue
            const [start, end] = days[i];
            hours.push(dayLabels[i] + '( ' + new Date(start).getHours() + '-' + new Date(end).getHours() + ')');
        }
        return hours.join(', ');
    }
    const [cantUpdate, setCantUpdate] = useState(false);
    const editItem = (item) => {
        if (item) {
            setMondayHour(0)
            setTuesdayHour(0)
            setWednesdayHour(0)
            setThursdayHour(0)
            setFridayHour(0)
            setSaturdayHour(0)
            setSundayHour(0)
            setEveryHours(0)
            setMondayNotWorking(false);
            setTuesdayNotWorking(false)
            setWednesdayNotWorking(false)
            setThursdayNotWorking(false)
            setFridayNotWorking(false)
            setSaturdayNotWorking(false)
            setSundayNotWorking(false)

            setMondayValue(false)
            setTuesdayValue(false)
            setWednesdayValue(false)
            setThursdayValue(false)
            setFridayValue(false)
            setSaturdayValue(false)
            setSundayValue(false)


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
                if (item.is_custom_monday) {
                    let hour = moment(item.monday[1]).hour() - moment(item.monday[0]).hour() || 0;
                    setMondayValue(true)
                    setMondayHour(hour)

                }
                else if (item.is_custom_monday === false) {
                    setMondayValue(false)
                    setMondayHour(moment(item.every_hours[1]).hour() - moment(item.every_hours[0]).hour())
                }
                else {
                    setMondayValue(false)
                    setMondayNotWorking(true)
                }
                if (item.is_custom_tuesday) {
                    setTuesdayValue(true)
                    setTuesdayHour(moment(item.tuesday[1]).hour() - moment(item.tuesday[0]).hour())
                }
                else if (item.is_custom_tuesday === false) {
                    setTuesdayValue(false)
                    setTuesdayHour(moment(item.every_hours[1]).hour() - moment(item.every_hours[0]).hour())
                }
                else {
                    setTuesdayValue(false)
                    setTuesdayNotWorking(true)
                }
                if (item.is_custom_wednesday) {
                    setWednesdayValue(true)
                    setWednesdayHour(moment(item.wednesday[1]).hour() - moment(item.wednesday[0]).hour())
                } else if (item.is_custom_wednesday === false) {
                    setWednesdayValue(false)
                    setWednesdayHour(moment(item.every_hours[1]).hour() - moment(item.every_hours[0]).hour())
                }
                else {
                    setWednesdayValue(false)
                    setWednesdayNotWorking(true)
                }
                if (item.is_custom_thursday) {
                    setThursdayValue(true)
                    setThursdayHour(moment(item.thursday[1]).hour() - moment(item.thursday[0]).hour())
                }
                else if (item.is_custom_thursday === false) {
                    setThursdayValue(false)
                    setThursdayHour(moment(item.every_hours[1]).hour() - moment(item.every_hours[0]).hour())
                }
                else {
                    setThursdayValue(false)
                    setThursdayNotWorking(true)
                }
                if (item.is_custom_friday) {
                    setFridayValue(true)
                    setFridayHour(moment(item.friday[1]).hour() - moment(item.friday[0]).hour())
                }
                else if (item.is_custom_friday === false) {
                    setFridayValue(false)
                    setFridayHour(moment(item.every_hours[1]).hour() - moment(item.every_hours[0]).hour())
                }
                else {
                    setFridayValue(false)
                    setFridayNotWorking(true)
                }
                if (item.is_custom_saturday) {
                    setSaturdayValue(true)
                    setSaturdayHour(moment(item.saturday[1]).hour() - moment(item.saturday[0]).hour())
                }
                else if (item.is_custom_saturday === false) {
                    setSaturdayValue(false)
                    setSaturdayHour(moment(item.every_hours[1]).hour() - moment(item.every_hours[0]).hour())
                }
                else {
                    setSaturdayValue(false)
                    setSaturdayNotWorking(true)
                }
                if (item.is_custom_sunday) {
                    setSundayValue(true)
                    setSundayHour(moment(item.sunday[1]).hour() - moment(item.sunday[0]).hour())
                }
                else if (item.is_custom_sunday === false) {
                    setSundayValue(false)
                    setSundayHour(moment(item.every_hours[1]).hour() - moment(item.every_hours[0]).hour())
                }
                else {
                    setSundayValue(false)
                    setSundayNotWorking(true)
                }
                if (item.every_hours) {
                    setEveryHours(moment(item.every_hours[1]).hour() - moment(item.every_hours[0]).hour())
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
                    every_hours: item.every_hours ? [moment(item.every_hours[0]), moment(item.every_hours[1])] : null,
                    employee: item.employee,
                    store: item.store._id,
                    sal_hr: item.sal_hr,
                    // hr_week: item.hr_week,
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
        if (mondayNotWorking) {
            values['monday'] = null;
        } else if (!mondayValue && !mondayNotWorking) {
            values['monday'] = values['every_hours']
            values['is_custom_monday'] = false
        } else if (mondayValue) {
            values['is_custom_monday'] = true;
        }
        if (tuesdayNotWorking) {
            values['tuesday'] = null;
        } else if (!tuesdayValue && !tuesdayNotWorking) {
            values['tuesday'] = values['every_hours']
            values['is_custom_tuesday'] = false
        } else if (tuesdayValue) {
            values['is_custom_tuesday'] = true;
        }
        if (wednesdayNotWorking) {
            values['wednesday'] = null;
        } else if (!wednesdayValue && !wednesdayNotWorking) {
            values['wednesday'] = values['every_hours']
            values['is_custom_wednesday'] = false
        } else if (wednesdayValue) {
            values['is_custom_wednesday'] = true;
        }
        if (thursdayNotWorking) {
            values['thursday'] = null;
        } else if (!thursdayValue && !thursdayNotWorking) {
            values['thursday'] = values['every_hours']
            values['is_custom_thursday'] = false
        } else if (thursdayValue) {
            values['is_custom_thursday'] = true;
        }
        if (fridayNotWorking) {
            values['friday'] = null;
        } else if (!fridayValue && !fridayNotWorking) {
            values['friday'] = values['every_hours']
            values['is_custom_friday'] = false
        } else if (fridayValue) {
            values['is_custom_friday'] = true;
        }
        if (saturdayNotWorking) {
            values['saturday'] = null;
        } else if (!saturdayValue && !saturdayNotWorking) {
            values['saturday'] = values['every_hours']
            values['is_custom_saturday'] = false
        } else if (saturdayValue) {
            values['is_custom_saturday'] = true;
        }

        if (sundayNotWorking) {
            values['sunday'] = null;
        } else if (!sundayValue && !sundayNotWorking) {
            values['sunday'] = values['every_hours']
            values['is_custom_sunday'] = false
        } else if (sundayValue) {
            values['is_custom_sunday'] = true;
        }

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
        // data.map(position => {
        //     const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = position
        //     if (monday === true) {
        //         position['monday'] = position['every_hours']
        //     }
        //     if (tuesday === true) {
        //         position['tuesday'] = position['every_hours']
        //     }
        //     if (wednesday === true) {
        //         position['wednesday'] = position['every_hours']
        //     }
        //     if (thursday === true) {
        //         position['thursday'] = position['every_hours']
        //     }
        //     if (friday === true) {
        //         position['friday'] = position['every_hours']
        //     }
        //     if (saturday === true) {
        //         position['saturday'] = position['every_hours']
        //     }
        //     if (sunday === true) {
        //         position['sunday'] = position['every_hours']
        //     }
        // })
        console.log(JSON.parse(JSON.stringify(data)), '-------------------');

        setItemLists(JSON.parse(JSON.stringify(data)) || [])
    }, [Items])

    const [mondayNotWorking, setMondayNotWorking] = useState(false);
    const [tuesdayNotWorking, setTuesdayNotWorking] = useState(false);
    const [wednesdayNotWorking, setWednesdayNotWorking] = useState(false);
    const [thursdayNotWorking, setThursdayNotWorking] = useState(false);
    const [fridayNotWorking, setFridayNotWorking] = useState(false);
    const [saturdayNotWorking, setSaturdayNotWorking] = useState(false);
    const [sundayNotWorking, setSundayNotWorking] = useState(true);



    const [mondayValue, setMondayValue] = useState(false);
    const [tuesdayValue, setTuesdayValue] = useState(false);
    const [wednesdayValue, setWednesdayValue] = useState(false);
    const [thursdayValue, setThursdayValue] = useState(false);
    const [fridayValue, setFridayValue] = useState(false);
    const [saturdayValue, setSaturdayValue] = useState(false);
    const [sundayValue, setSundayValue] = useState(false);

    const [workContract, setWorkContract] = useState([]);
    const [viaticumContract, setViaticumContract] = useState([]);
    const [stores, setStores] = useState([]);
    const { result: Contracts } = useSelector(selectListsByContract);
    const [isEmployee, setIsEmployee] = useState(false);
    const [isViaticum, setIsViaticum] = useState(false);
    const [isContract, setIsContract] = useState(false);
    const [workContracts, setWorkContracts] = useState();
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(false);

    const [mondayHour, setMondayHour] = useState(0);
    const [tuesdayHour, setTuesdayHour] = useState(0);
    const [wednesdayHour, setWednesdayHour] = useState(0);
    const [thursdayHour, setThursdayHour] = useState(0);
    const [fridayHour, setFridayHour] = useState(0);
    const [saturdayHour, setSaturdayHour] = useState(0);
    const [sundayHour, setSundayHour] = useState(0);
    const [everyHours, setEveryHours] = useState(0)
    useEffect(() => {
        let totalHours = 0;
        console.log(mondayHour, tuesdayHour, wednesdayHour, thursdayHour, fridayHour, saturdayHour, sundayHour, everyHours, 'everyHours')

        if (mondayNotWorking) {
            totalHours += 0
        } else if (mondayValue || mondayHour) {
            totalHours += mondayHour
        } else {
            totalHours += everyHours
        }

        if (tuesdayNotWorking) {
            totalHours += 0
        } else if (tuesdayValue || tuesdayHour) {
            totalHours += tuesdayHour
        } else {
            totalHours += everyHours
        }
        if (wednesdayNotWorking) {
            totalHours += 0
        } else if (wednesdayValue || wednesdayHour) {
            totalHours += wednesdayHour
        } else {
            totalHours += everyHours
        }
        if (thursdayNotWorking) {
            totalHours += 0
        } else if (thursdayValue || thursdayHour) {
            totalHours += thursdayHour
        } else {
            totalHours += everyHours
        }
        if (fridayNotWorking) {
            totalHours += 0
        } else if (fridayValue || fridayHour) {
            totalHours += fridayHour
        } else {
            totalHours += everyHours
        }
        if (saturdayNotWorking) {
            totalHours += 0
        } else if (saturdayValue || saturdayHour) {
            totalHours += saturdayHour
        } else {
            totalHours += everyHours
        }
        if (sundayNotWorking) {
            totalHours += 0
        } else if (sundayValue || sundayHour) {
            totalHours += sundayHour
        } else {
            totalHours += everyHours
        }

        if (formRef.current) {
            formRef.current.setFieldsValue({ "hr_week": totalHours })
        }
    }, [mondayHour, tuesdayHour, wednesdayHour, thursdayHour, fridayHour, saturdayHour, sundayHour, everyHours, mondayNotWorking, tuesdayNotWorking, wednesdayNotWorking, thursdayNotWorking, fridayNotWorking, saturdayNotWorking, sundayNotWorking, mondayValue, tuesdayValue, wednesdayValue, thursdayValue, fridayValue, saturdayValue, sundayValue])



    useEffect(() => {
        if (!mondayValue && !mondayNotWorking) {
            setMondayHour(everyHours)
        }
        if (!tuesdayValue && !tuesdayNotWorking) {
            setTuesdayHour(everyHours)
        }
        if (!wednesdayValue && !wednesdayNotWorking) {
            setWednesdayHour(everyHours)
        }
        if (!thursdayValue && !thursdayNotWorking) {
            setThursdayHour(everyHours)
        }
        if (!fridayValue && !fridayNotWorking) {
            setFridayHour(everyHours)
        }
        if (!saturdayValue && !saturdayNotWorking) {
            setSaturdayHour(everyHours)
        }
        if (!sundayValue && !sundayNotWorking) {
            setSundayHour(everyHours)
        }
    }, [
        everyHours, mondayNotWorking, tuesdayNotWorking, wednesdayNotWorking, thursdayNotWorking, fridayNotWorking, saturdayNotWorking, sundayNotWorking, mondayValue, tuesdayValue, wednesdayValue, thursdayValue, fridayValue, saturdayValue, sundayValue
    ])
    useEffect(() => {
        if (formRef.current) {

            if ((!mondayValue)) {
                formRef.current.setFieldsValue({ monday: null })
            }
            if ((!tuesdayValue)) {
                formRef.current.setFieldsValue({ tuesday: null })
            }
            if ((!wednesdayValue)) {
                formRef.current.setFieldsValue({ wednesday: null })
            }
            if ((!thursdayValue)) {
                formRef.current.setFieldsValue({ thursday: null })
            }
            if ((!fridayValue)) {
                formRef.current.setFieldsValue({ friday: null })
            }
            if ((!saturdayValue)) {
                formRef.current.setFieldsValue({ saturday: null })
            }
            if ((!sundayValue)) {
                formRef.current.setFieldsValue({ sunday: null })
            }
        }
    }, [
        mondayNotWorking, tuesdayNotWorking, wednesdayNotWorking, thursdayNotWorking, fridayNotWorking, saturdayNotWorking, sundayNotWorking, mondayValue, tuesdayValue, wednesdayValue, thursdayValue, fridayValue, saturdayValue, sundayValue
    ])
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
    const validateTimeRange = (rule, value) => {
        console.log(rule, value, 'valuevaluevalue');
        if (!value || !value[0] || !value[1]) {
            return Promise.reject('This field is required');
        }
        return Promise.resolve();
    };
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
                                name="every_hours"
                                label="Hours"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <TimePicker.RangePicker format={"h a"} hideDisabledOptions hourStep={1}
                                    minuteStep={15}
                                    onChange={(e) => { setEveryHours(!e ? 0 : moment(e[1]).hour() - moment(e[0]).hour()) }}
                                />
                            </Form.Item>
                            <Form.Item
                                name="monday"
                                label={
                                    <div >
                                        Monday
                                        <Checkbox
                                            checked={mondayValue}
                                            onChange={(e) => {
                                                e.target.checked ? (
                                                    setMondayValue(true),
                                                    setMondayNotWorking(false)
                                                ) : (
                                                    setMondayValue(false),
                                                    setMondayHour(0)
                                                )
                                            }}
                                        >
                                            Custom
                                        </Checkbox>
                                        <Checkbox
                                            checked={mondayNotWorking}
                                            onChange={(e) => {
                                                (mondayValue && e.target.checked) ? (
                                                    setMondayValue(false),
                                                    setMondayNotWorking(true),
                                                    setMondayHour(0)
                                                ) : e.target.checked ? (
                                                    (setMondayNotWorking(true), setMondayHour(0))
                                                ) : (
                                                    setMondayNotWorking(false)
                                                );
                                            }}
                                        >
                                            Not Working
                                        </Checkbox>
                                    </div>
                                }
                                labelCol={{
                                    offset: 5,
                                    span: 12,
                                }}
                                rules={
                                    mondayValue ?
                                        [
                                            { required: true },
                                        ] : null}
                            >
                                {mondayValue && (
                                    <TimePicker.RangePicker name="monday" format={"HH a"} onChange={(e) => { setMondayHour(!e ? 0 : moment(e[1]).hour() - moment(e[0]).hour()) }} />
                                )}
                            </Form.Item>
                            <Form.Item
                                name="tuesday"
                                label={
                                    <div >
                                        Tuesday
                                        <Checkbox checked={tuesdayValue} onChange={(e) => { e.target.checked ? (setTuesdayValue(true), setTuesdayNotWorking(false)) : setTuesdayValue(false) }}>Custom</Checkbox>
                                        <Checkbox checked={tuesdayNotWorking} onChange={(e) => { (tuesdayValue && e.target.checked) ? (setTuesdayValue(false), setTuesdayNotWorking(true), setTuesdayHour(0)) : e.target.checked ? (setTuesdayNotWorking(true), setTuesdayHour(0)) : setTuesdayNotWorking(false) }} >Not Working</Checkbox>
                                    </div>
                                }
                                labelCol={{
                                    offset: 5,
                                    span: 12,
                                }}
                                rules={
                                    tuesdayValue ?
                                        [
                                            { required: true },
                                        ] : null}
                            >

                                {tuesdayValue &&
                                    <TimePicker.RangePicker format={"h a"} onChange={(e) => { setTuesdayHour(!e ? 0 : moment(e[1]).hour() - moment(e[0]).hour()) }} />
                                }
                            </Form.Item>
                            <Form.Item
                                name="wednesday"
                                label={
                                    <div >
                                        Wednesday
                                        <Checkbox checked={wednesdayValue} onChange={(e) => { e.target.checked ? (setWednesdayValue(true), setWednesdayNotWorking(false)) : setWednesdayValue(false) }}>Custom</Checkbox>
                                        <Checkbox checked={wednesdayNotWorking} onChange={(e) => { (wednesdayValue && e.target.checked) ? (setWednesdayValue(false), setWednesdayNotWorking(true), setWednesdayHour(0)) : e.target.checked ? (setWednesdayNotWorking(true), setWednesdayHour(0)) : setWednesdayNotWorking(false) }} >Not Working</Checkbox>
                                    </div>
                                }
                                labelCol={{
                                    offset: 5,
                                    span: 12,
                                }}
                                rules={
                                    wednesdayValue ?
                                        [
                                            { required: true },
                                        ] : null}
                            >
                                {wednesdayValue &&
                                    <TimePicker.RangePicker format={"h a"} onChange={(e) => { setWednesdayHour(!e ? 0 : moment(e[1]).hour() - moment(e[0]).hour()) }} />
                                }
                            </Form.Item>
                            <Form.Item
                                name="thursday"
                                label={
                                    <div >
                                        Thursday
                                        <Checkbox checked={thursdayValue} onChange={(e) => { e.target.checked ? (setThursdayValue(true), setThursdayNotWorking(false)) : setThursdayValue(false) }}>Custom</Checkbox>
                                        <Checkbox checked={thursdayNotWorking} onChange={(e) => { (thursdayValue && e.target.checked) ? (setThursdayValue(false), setThursdayNotWorking(true), setTuesdayHour(0)) : e.target.checked ? (setThursdayNotWorking(true), setTuesdayHour(0)) : setThursdayNotWorking(false) }} >Not Working</Checkbox>
                                    </div>
                                }
                                labelCol={{
                                    offset: 5,
                                    span: 12,
                                }}
                                rules={
                                    thursdayValue ?
                                        [
                                            { required: true },
                                        ] : null}

                            >
                                {thursdayValue &&
                                    <TimePicker.RangePicker format={"h a"} onChange={(e) => { setThursdayHour(!e ? 0 : moment(e[1]).hour() - moment(e[0]).hour()) }} />
                                }
                            </Form.Item>
                            <Form.Item
                                name="friday"
                                label={
                                    <div >
                                        Friday
                                        <Checkbox checked={fridayValue} onChange={(e) => { e.target.checked ? (setFridayValue(true), setFridayNotWorking(false)) : setFridayValue(false) }}>Custom</Checkbox>
                                        <Checkbox checked={fridayNotWorking} onChange={(e) => { (fridayValue && e.target.checked) ? (setFridayValue(false), setFridayNotWorking(true), setFridayHour(0)) : e.target.checked ? (setFridayNotWorking(true), setFridayHour(0)) : setFridayNotWorking(false) }} >Not Working</Checkbox>
                                    </div>
                                }
                                labelCol={{
                                    offset: 5,
                                    span: 12,
                                }}
                                rules={
                                    fridayValue ?
                                        [
                                            { required: true },
                                        ] : null}
                            >
                                {fridayValue &&
                                    <TimePicker.RangePicker format={"h a"} onChange={(e) => { setFridayHour(!e ? 0 : moment(e[1]).hour() - moment(e[0]).hour()) }} />
                                }
                            </Form.Item>
                            <Form.Item
                                name="saturday"
                                label={
                                    <div >
                                        Saturday
                                        <Checkbox checked={saturdayValue} onChange={(e) => { e.target.checked ? (setSaturdayValue(true), setSaturdayNotWorking(false)) : setSaturdayValue(false) }}>Custom</Checkbox>
                                        <Checkbox checked={saturdayNotWorking} onChange={(e) => { (saturdayValue && e.target.checked) ? (setSaturdayValue(false), setSaturdayNotWorking(true), setSaturdayHour(0)) : e.target.checked ? (setSaturdayNotWorking(true), setSaturdayHour(0)) : setSaturdayNotWorking(false) }} >Not Working</Checkbox>
                                    </div>
                                }
                                labelCol={{
                                    offset: 5,
                                    span: 12,
                                }}
                                rules={
                                    saturdayValue ?
                                        [
                                            { required: true },
                                        ] : null}
                            >
                                {saturdayValue &&
                                    <TimePicker.RangePicker format={"h a"} onChange={(e) => { setSaturdayHour(!e ? 0 : moment(e[1]).hour() - moment(e[0]).hour()) }} />
                                }
                            </Form.Item>
                            <Form.Item
                                name="sunday"
                                label={
                                    <div >
                                        Sunday
                                        <Checkbox checked={sundayValue} onChange={(e) => { e.target.checked ? (setSundayValue(true), setSundayNotWorking(false)) : setSundayValue(false) }}>Custom</Checkbox>
                                        <Checkbox checked={sundayNotWorking} onChange={(e) => { (sundayValue && e.target.checked) ? (setSundayValue(false), setSundayNotWorking(true), setSaturdayHour(0)) : e.target.checked ? (setSundayNotWorking(true), setSaturdayHour(0)) : setSundayNotWorking(false) }} >Not Working</Checkbox>
                                    </div>
                                }
                                labelCol={{
                                    offset: 5,
                                    span: 12,
                                }}
                                rules={
                                    sundayValue ?
                                        [
                                            { required: true },
                                        ] : null}
                            >
                                {sundayValue &&
                                    <TimePicker.RangePicker format={"h a"} onChange={(e) => { setSundayHour(!e ? 0 : moment(e[1]).hour() - moment(e[0]).hour()) }} />
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
                                <Input type='number' readOnly />
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
            </Modal >
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
        </div >
    );
}

export default AssignedEmployee;