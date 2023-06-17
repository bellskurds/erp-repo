import { crud } from "@/redux/crud/actions";
import { selectListItems, selectReadItem } from "@/redux/crud/selectors";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Popconfirm, Row, Table, Tag, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom.min";


const BankAccount = (props) => {
    const entity = 'bankAccount';
    const dispatch = useDispatch();
    const currentEmployeeId = props.parentId
    const [isBankModal, setIsBankModal] = useState(false);
    const formRef = useRef(null);
    const bankColumns = [
        {
            title: 'Bank',
            dataIndex: 'bank',
        },
        {
            title: 'Account type',
            dataIndex: 'account_type',
        },

        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Account No',
            dataIndex: 'account_no',
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
    const { result: bankItems } = useSelector(selectReadItem);

    const editBankModal = () => {
        setIsBankModal(true);
        if (formRef) formRef.current.resetFields();
    }
    const editItem = (item) => {
        if (item) {

            if (formRef.current) formRef.current.setFieldsValue(item);
            setCurrentId(item._id);
            setIsBankModal(true);
        }
    }
    const deleteItem = (item) => {
        const id = item._id;
        dispatch(crud.delete({ entity, id }))
        setTimeout(() => {
            dispatch(crud.list({ entity }));
        }, 1000)
    }
    const handleBankModal = () => {
        setIsBankModal(false)
    }
    const saveBankDetails = (values) => {
        if (currentEmployeeId) {

            const id = currentEmployeeId;
            values["parent_id"] = currentEmployeeId;
            dispatch(crud.create({ entity, id, jsonData: values }));
            setIsBankModal(false)
            setTimeout(() => {
                dispatch(crud.list({ entity }));
            }, 500)
        }
    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    useEffect(() => {
        const id = currentEmployeeId;
        dispatch(crud.list({ entity }));
    }, [currentEmployeeId]);
    const items = bankItems.items
    console.log(bankItems, 'ItemsItemsItemsItemsItems')
    return (

        <div className="whiteBox shadow">
            <Modal title="Bank Form" visible={isBankModal} onCancel={handleBankModal} footer={null}>
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
                    <Form.Item
                        name="bank"
                        label="Bank"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="account_type"
                        label="Account Type"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="account_no"
                        label="Account No"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        {

                            <Button type="primary" htmlType="submit">
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
                    <h3 style={{ color: '#22075e', marginBottom: 5 }}>Bank Account</h3>
                </Col>
                <Col span={12}>
                    <Button type="primary" onClick={editBankModal}>Add</Button>
                </Col>
            </Row>
            <Table
                bordered
                rowKey={(item) => item._id}
                key={(item) => item._id}
                dataSource={items ? items : []}
                columns={bankColumns}
                rowClassName="editable-row"


            />
        </div>
    );
}

export default BankAccount;