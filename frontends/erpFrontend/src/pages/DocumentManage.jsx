import * as XLSX from 'xlsx';
import { crud } from "@/redux/crud/actions";
import { selectListsByCustomerStores, selectListsByDocument, selectListsByInvoice, selectListsByRecurrent, } from "@/redux/crud/selectors";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Radio, Row, Select, Table, Typography, Upload, message } from "antd";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";


const DocumentManage = (props) => {
    const entity = 'documentManage';
    const dispatch = useDispatch();
    const currentEmployeeId = props.parentId
    const [isModal, setIsModal] = useState(false);
    const RecurrentRef = useRef(null);

    const [currentFile, setCurrentFile] = useState()


    const Columns = [
        {
            title: 'Name',
            dataIndex: 'filename',

        },
        {
            title: 'Date',
            dataIndex: 'created',
            render: (text) => {
                return formattedDateFunc(text)
            }
        },

        {
            title: 'Comments',
            dataIndex: 'comments',
        },
        {
            title: 'By',
            dataIndex: ['parent_id', 'name'],
        },

        {
            title: 'Actions',
            dataIndex: 'operation',
            width: "10%",
            align: 'center',
            render: (_, record) => {
                return (

                    <>

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
                const updateData = documents.filter(row => row._id !== id);
                setDocuments(updateData);
                dispatch(crud.listByRecurrent({ entity, jsonData }));
            }, 500)
        }

    }
    const handleModal = () => {
        setIsModal(false)
    }
    const saveDetails = (values) => {
        console.log(values, 'valu45345es', currentFile);
        const formData = new FormData();
        formData.append('file', currentFile, `${values.filename}.${currentFile.name.split(".")[1]}`);

        formData.append('parent_id', currentEmployeeId);
        formData.append('filename', values.filename);
        formData.append('comments', values.comments);
        dispatch(crud.upload({ entity, jsonData: formData }));


        const parentId = currentEmployeeId;
        const jsonData = { parent_id: parentId }
        setTimeout(() => {
            dispatch(crud.listByDocument({ entity, jsonData }));
        }, 500)
        setIsModal(false)
    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const [stores, setStores] = useState([]);
    const [documents, setDocuments] = useState([]);
    const { result: Documents } = useSelector(selectListsByDocument);


    useEffect(() => {
        const id = currentEmployeeId;
        const jsonData = { parent_id: id }
        dispatch(crud.listByDocument({ entity, jsonData }));
    }, []);
    const [unlimited, setUnlimited] = useState(false);
    const [taxesStatus, setTaxesStatus] = useState(false);
    useEffect(() => {

        if (Documents.items) {

            setDocuments(Documents.items)

        }
    }, [Documents])
    const UnlimitedStatus = (e) => {
        setUnlimited(e.target.checked)
    }
    const isTaxes = (e) => {
        setTaxesStatus(e.target.value)
    }


    const handleUpload = (e) => {
        e.preventDefault();

        const file = e.target.files[0];
        setCurrentFile(file);

        // const id = currentEmployeeId;

        // const formData = new FormData();
        // formData.append('avatar', file);
        // // formData.append('id', parent_id);
        // dispatch(crud.upload({ entity, jsonData: formData }));
        // message.info(`Uploading ${file.name}...`);
        // setTimeout(() => {
        //     dispatch(crud.read({ entity, id }));
        // }, 500)
    };
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <div className="whiteBox shadow">
            <Modal title="File" visible={isModal} onCancel={handleModal} footer={null} width={800}>
                <Row gutter={24}>
                    <Col span={8}>

                        <Input
                            type='file'
                            name='file'
                            onChange={handleUpload}
                        />
                    </Col>
                    <Col>

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
                                name="filename"
                                label="File Name"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input width={1000} />
                            </Form.Item>
                            <Form.Item
                                name="comments"
                                label="Comments"
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

                    </Col>
                </Row>
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
                dataSource={documents || []}
                columns={Columns}
                rowClassName="editable-row"
            />
        </div>
    );
}
export default DocumentManage;