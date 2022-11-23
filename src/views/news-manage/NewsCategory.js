import React, {useContext, useEffect, useRef, useState} from "react";
import {Button, Form, Input, Modal, Table} from "antd";
import {DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import axios from "axios";

const {confirm} = Modal;

const EditableContext = React.createContext(null);
const EditableRow = ({index, ...props}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
const EditableCell = ({title, editable, children, dataIndex, record, handleSave, ...restProps}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};


export default function NewCategory() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get(`/categories`).then(res => {
            setCategories(res.data);
        })
    }, [])

    const deleteItem = item => {
        axios.delete(`/categories/${item.id}`).then(() => {
            setCategories(categories.filter(category => category.id !== item.id));
        })
    };

    const handleSave = (modifiedCategory) => {
        axios.patch(`/categories/${modifiedCategory.id}`, {
            name: modifiedCategory.name
        }).then(() => {
            setCategories(categories.map(category => {
                if (modifiedCategory.id === category.id) {
                    return {
                        id: category.id,
                        name: modifiedCategory.name
                    }
                }
                return category;
            }))
        })
    };

    const showConfirm = item => {
        confirm({
            title: 'Do you want to delete these items?',
            icon: <ExclamationCircleOutlined/>,

            onOk() {
                deleteItem(item);
            },

            onCancel() {
                console.log('Cancel');
            },
        });
    };


    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            render: (id) => {
                return <b>{id}</b>;
            },
        },
        {
            title: "分類名稱",
            dataIndex: "name",
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: "name",
                title: "分類名稱",
                handleSave
            })
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => showConfirm(item)}/>
                </div>

            },
        }]

    return <div>
        <Table
            components={{
                body: {
                    row: EditableRow,
                    cell: EditableCell,
                },
            }}
            dataSource={categories}
            columns={columns}
            rowKey={(item) => {
                return item.id;
            }}>
        </Table>
    </div>
}