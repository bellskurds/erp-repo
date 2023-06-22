import { crud } from "@/redux/crud/actions";
import { selectListsByCustomerStores, selectListsByRecurrent, } from "@/redux/crud/selectors";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Radio, Row, Select, Table, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";


const InvoiceHistory = (props) => {
    const entity = 'recurrentInvoice';
    const dispatch = useDispatch();
    const currentEmployeeId = props.parentId
    const [isModal, setIsModal] = useState(false);
    const RecurrentRef = useRef(null);
    const Columns = [
        {
            title: 'Date',
            dataIndex: 'start_date',
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },

        {
            title: 'Amount',
            dataIndex: 'amount',
        },
        {
            title: 'Details',
            dataIndex: 'details',
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

    const editModal = () => {
        setIsModal(true);
        setIsUpdate(false);
        if (RecurrentRef.current) RecurrentRef.current.resetFields();
    }
    const formattedDateFunc = (date) => {
        return new Date(date).toLocaleDateString()
    }

    const editItem = (item) => {
        if (item) {
            setIsModal(true);
            setIsUpdate(true);

            setTaxesStatus(true)
            setTimeout(() => {
                setUnlimited(item.unlimited)
                if (RecurrentRef.current) {
                    RecurrentRef.current.resetFields();
                    RecurrentRef.current.setFieldsValue({
                        start_date: moment(item.start_date),
                        end_date: moment(item.end_date),
                        description: item.description,
                        amount: item.amount,
                        frequency: item.frequency,
                        store: item.store._id,
                        taxes: item.taxes,
                        taxes_flag: item.taxes_flag
                    });
                    setTaxesStatus(item.taxes_flag)
                    setCurrentId(item._id);
                }
            }, 200);

        }
    }
    const deleteItem = (item) => {
        const id = item._id;
        if (id) {
            const jsonData = { parent_id: currentEmployeeId }
            dispatch(crud.delete({ entity, id }))
            setTimeout(() => {
                const updateData = recurrents.filter(row => row._id !== id);
                setRecurrents(updateData);
                dispatch(crud.listByRecurrent({ entity, jsonData }));
            }, 500)
        }

    }
    const handleModal = () => {
        setIsModal(false)
    }
    const saveDetails = (values) => {
        values["unlimited"] = unlimited;
        values["start_date"] = formattedDateFunc(values["start_date"]);
        if (!unlimited) values["end_date"] = formattedDateFunc(values["end_date"]);
        const parentId = currentEmployeeId;
        if (currentId && parentId && isUpdate) {
            const id = currentId;
            const jsonData = { parent_id: parentId }
            values["parent_id"] = parentId;
            dispatch(crud.update({ entity, id, jsonData: values }));
            setIsModal(false)
            setTimeout(() => {
                dispatch(crud.listByRecurrent({ entity, jsonData }));
            }, 500)
        } else {
            const jsonData = { parent_id: parentId }
            const id = currentId;
            values["parent_id"] = parentId;
            dispatch(crud.create({ entity, id, jsonData: values }));
            setIsModal(false)
            setTimeout(() => {
                dispatch(crud.listByRecurrent({ entity, jsonData }));
            }, 500)
        }
    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const [stores, setStores] = useState([]);
    const [recurrents, setRecurrents] = useState([]);
    const { result: Stores } = useSelector(selectListsByCustomerStores);
    const { result: Recurrents } = useSelector(selectListsByRecurrent);
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
        const recurrentOptions = Recurrents.items || [];
        if (recurrentOptions) {
            setRecurrents(recurrentOptions);
        } else {
            setStores([]);
        }

    }, [Recurrents])


    useEffect(() => {
        const id = currentEmployeeId;
        const jsonData = { parent_id: id }
        dispatch(crud.listByCustomerStores({ entity: "customerStores", jsonData: { parent_id: currentEmployeeId } }))
        dispatch(crud.listByRecurrent({ entity, jsonData }));
    }, []);
    const [unlimited, setUnlimited] = useState(false);
    const [taxesStatus, setTaxesStatus] = useState(false);
    useEffect(() => {
        console.log(unlimited, 'sdfhsjdflahsldfkjhalsdhfjhalskdhfjkl')
    }, [unlimited])
    const UnlimitedStatus = (e) => {
        setUnlimited(e.target.checked)
    }
    const isTaxes = (e) => {
        setTaxesStatus(e.target.value)
    }
    return (
        <div className="whiteBox shadow">
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
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item
                                name="amount"
                                label="Amount"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber />
                            </Form.Item>
                            <Form.Item
                                name="taxes_flag"
                                label="Taxes"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Radio.Group value={isTaxes} onChange={isTaxes} options={[{
                                    label: "Yes",
                                    value: true
                                }, {
                                    label: "No",
                                    value: false
                                }]} />
                            </Form.Item>
                            {taxesStatus &&
                                <Form.Item
                                    name="taxes"
                                    label=" "
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <InputNumber />
                                </Form.Item>
                            }
                            <Form.Item
                                name="frequency"
                                label="Frequency"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <InputNumber />
                            </Form.Item>
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
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={stores}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="start_date"

                                label="start"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <DatePicker format={"MM/DD/YYYY"} />
                            </Form.Item>

                            {!unlimited &&
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
                                </Form.Item>}
                            <Form.Item
                                name="unlimited"
                                label="Unlimited"
                            >
                                <Checkbox checked={unlimited} onChange={UnlimitedStatus} />
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

                        <Button type="ghost" onClick={handleModal}>
                            cancel
                        </Button>
                    </Form.Item>
                </Form>
                <>
                </>
            </Modal>
            <Row>
                <Col span={3}>
                    <h3 style={{ color: '#22075e', marginBottom: 5 }}>Invoice History</h3>
                </Col>
                <Col span={12}>
                    <Button type="primary" onClick={editModal}>Export</Button>
                </Col>
            </Row>
            <Table
                bordered
                rowKey={(item) => item._id}
                key={(item) => item._id}
                dataSource={[]}
                columns={Columns}
                rowClassName="editable-row"
            />
        </div>
    );
}
export default InvoiceHistory;