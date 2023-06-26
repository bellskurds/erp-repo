import * as XLSX from 'xlsx';
import { crud } from "@/redux/crud/actions";
import { selectListsByCustomerStores, selectListsByInvoice, selectListsByRecurrent, } from "@/redux/crud/selectors";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Radio, Row, Select, Table, Typography, Upload, message } from "antd";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";


const DocumentManage = (props) => {
    const entity = 'invoiceHistory';
    const dispatch = useDispatch();
    const currentEmployeeId = props.parentId
    const [isModal, setIsModal] = useState(false);
    const RecurrentRef = useRef(null);
    const Columns = [
        {
            title: 'Name',
            dataIndex: 'start_date',
            render: (text) => {
                return (formattedDateFunc(text));
            }
        },
        {
            title: 'Date',
            dataIndex: ['recurrent_id', 'description'],
        },

        {
            title: 'Comments',
            dataIndex: 'amount',
        },
        {
            title: 'By',
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

                        {/* <Popconfirm title="Sure to delete?" onConfirm={() => deleteItem(record)}>
                            <DeleteOutlined style={{ fontSize: "20px" }} />
                        </Popconfirm> */}
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
                        amount: item.amount,
                        details: item.details
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
                const updateData = Invoices.filter(row => row._id !== id);
                setInvoices(updateData);
                dispatch(crud.listByRecurrent({ entity, jsonData }));
            }, 500)
        }

    }
    const handleModal = () => {
        setIsModal(false)
    }
    const saveDetails = (values) => {
        const parentId = currentEmployeeId;
        if (currentId && parentId && isUpdate) {
            const id = currentId;
            const jsonData = { parent_id: parentId }
            dispatch(crud.update({ entity, id, jsonData: values }));
            setIsModal(false)
            setTimeout(() => {
                dispatch(crud.listByInvoice({ entity, jsonData }));
            }, 500)
        } else {
            const jsonData = { parent_id: parentId }
            const id = currentId;
            values["parent_id"] = parentId;
            dispatch(crud.create({ entity, id, jsonData: values }));
            setIsModal(false)
            setTimeout(() => {
                dispatch(crud.listByInvoice({ entity, jsonData }));
            }, 500)
        }
    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const [stores, setStores] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const { result: Invoices } = useSelector(selectListsByInvoice);


    useEffect(() => {
        const id = currentEmployeeId;
        const jsonData = { parent_id: id }
        dispatch(crud.listByInvoice({ entity, jsonData }));
    }, []);
    const [unlimited, setUnlimited] = useState(false);
    const [taxesStatus, setTaxesStatus] = useState(false);
    useEffect(() => {

        if (Invoices.items) {

            const filterData = Invoices.items.filter(obj => new Date(obj.start_date).getMonth() <= new Date().getMonth());
            // console.log(filterData, 'ddfilterData')
            setInvoices(filterData)

        }
    }, [Invoices])
    const UnlimitedStatus = (e) => {
        setUnlimited(e.target.checked)
    }
    const isTaxes = (e) => {
        setTaxesStatus(e.target.value)
    }


    const handleUpload = (file) => {
        const id = currentEmployeeId;

        const formData = new FormData();
        formData.append('avatar', file);
        // formData.append('id', parent_id);
        dispatch(crud.upload({ entity, jsonData: formData }));
        message.info(`Uploading ${file.name}...`);
        setTimeout(() => {
            dispatch(crud.read({ entity, id }));
        }, 500)
    };
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <div className="whiteBox shadow">
            <Modal title="Recurrent invoice" visible={isModal} onCancel={handleModal} footer={null} width={1000}>
                <Upload
                    showUploadList={false}
                    name='avatar'
                    listType="picture-card"
                // beforeUpload={handleUpload}
                >
                    {uploadButton}
                </Upload>
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
                    <Form.Item
                        name="amount"
                        label="Amount"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <InputNumber width={1000} />
                    </Form.Item>
                    <Form.Item
                        name="details"
                        label="Details"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input.TextArea />
                    </Form.Item>
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
                <Col span={12}>
                    <button onClick={editModal}>Add File</button>
                </Col>
            </Row>
            <Table
                bordered
                rowKey={(item) => item._id}
                key={(item) => item._id}
                dataSource={invoices || []}
                columns={Columns}
                rowClassName="editable-row"
            />
        </div>
    );
}
export default DocumentManage;