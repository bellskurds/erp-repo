import { crud } from "@/redux/crud/actions";
import { selectFilteredItemsByParent, selectListItems, selectListsByEmergency, selectListsByMedical, selectReadItem } from "@/redux/crud/selectors";
import { DeleteOutlined, EditOutlined, EyeOutlined, NumberOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Radio, Row, Table, Tag, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom.min";


const Contract = (props) => {
    const entity = 'medicalDetail';
    const dispatch = useDispatch();
    const currentEmployeeId = props.parentId
    const [isBankModal, setIsBankModal] = useState(false);
    const formRef = useRef(null);
    const contractTypes = [
        {
            value: 1,
            label: "Payroll"
        }, {
            value: 2,
            label: "Services"
        }
    ]
    const Columns = [
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Description',
            dataIndex: 'description',
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
            dispatch(crud.listByMedical({ entity, jsonData }));
        }, 500)
    }
    const handleBankModal = () => {
        setIsBankModal(false)
    }
    const saveDetails = (values) => {
        console.log(values, '333343434')
        // const parentId = currentEmployeeId;
        // if (currentId && parentId && isUpdate) {
        //     const id = currentId;
        //     const jsonData = { parent_id: parentId }
        //     values["parent_id"] = parentId;
        //     dispatch(crud.update({ entity, id, jsonData: values }));
        //     setIsBankModal(false)
        //     setTimeout(() => {
        //         dispatch(crud.listByMedical({ entity, jsonData }));
        //     }, 500)
        // } else {
        //     const jsonData = { parent_id: parentId }
        //     const id = currentId;
        //     values["parent_id"] = parentId;
        //     dispatch(crud.create({ entity, id, jsonData: values }));
        //     setIsBankModal(false)
        //     setTimeout(() => {
        //         dispatch(crud.listByMedical({ entity, jsonData }));
        //     }, 500)
        // }
    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const { result: Items } = useSelector(selectListsByMedical);

    useEffect(() => {
        const id = currentEmployeeId;
        const jsonData = { parent_id: id }
        // dispatch(crud.resetState());
        console.log(id, jsonData, '3333333')
        dispatch(crud.listByMedical({ entity, jsonData }));
    }, []);
    const items = Items.items ? Items.items.filter(obj => obj.parent_id === currentEmployeeId) : [];
    console.log(items, 'medical sdfasdfsad')

    const [salaryHour, setSalaryHour] = useState(0);
    const [hourWeek, setHourWeek] = useState(0);
    const [salaryMonthly, setSalaryMonthly] = useState(0);

    useEffect(() => {
        const monthly = (salaryHour * hourWeek * 4.333).toFixed();
        setSalaryMonthly(monthly)
        console.log(monthly, 'monthlymonthly')
    }, [
        salaryHour, hourWeek
    ])
    // const items = []
    // console.log(bankItems, 'ItemsItemsItemsItemsItems')
    return (

        <div className="whiteBox shadow">
            <Modal title="Work Contract" visible={isBankModal} onCancel={handleBankModal} footer={null} width={700}>
                <Form
                    ref={formRef}
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 24,
                    }}
                    onFinish={saveDetails}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={{
                        sal_hr: 0,
                        hr_week: 0
                    }}

                >
                    <Row gutter={24}>
                        <Col span={12}>

                            <Form.Item
                                name="sal_hr"
                                label="Sal/Hr"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber onChange={(e) => { setSalaryHour(e) }} />
                            </Form.Item>
                            <Form.Item
                                name="hr_week"
                                label="Hr / Week"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber onChange={(e) => { setHourWeek(e) }} />
                            </Form.Item>
                            <Form.Item
                                name="start_date"
                                label="Start"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <DatePicker format={"MM/DD/YYYY"} />
                            </Form.Item>
                            <Form.Item
                                name="end_date"
                                label="End"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <DatePicker format={"MM/DD/YYYY"} />
                            </Form.Item>
                            <Form.Item
                                name="type"
                                label="Type"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Radio.Group name="radiogroup" options={contractTypes} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                // wrapperCol={{
                                //     offset: 8,
                                //     span: 16,
                                // }}
                                name="sal_monthly"
                                label="Sal/Mon"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <label>{Number(salaryMonthly).toFixed(2)} </label>

                            </Form.Item>
                            <Form.Item
                            // wrapperCol={{
                            //     offset: 8,
                            //     span: 16,
                            // }}
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

                        </Col>
                    </Row>

                </Form>
                <>
                </>
            </Modal>
            <Row>
                <Col span={5}>
                    <h3 style={{ color: '#22075e', marginBottom: 5 }}>Contracts</h3>
                </Col>
                <Col span={12}>
                    <Button type="primary" onClick={editBankModal}>Add</Button>
                </Col>
            </Row>
            <Table
                bordered
                rowKey={(item) => item._id}
                key={(item) => item._id}
                dataSource={items}
                columns={Columns}
                rowClassName="editable-row"


            />
        </div>
    );
}

export default Contract;