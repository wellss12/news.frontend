import React, {useEffect, useRef, useState} from "react";
import {Button, Modal, Switch, Table} from "antd";
import axios from "axios";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {UserForm} from "../../../components/user-manage/UserForm";

const {confirm} = Modal;

export function UserList() {
    const [users, setUsers] = useState([]);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [regions, setRegions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isUpdateRegionDisabled, setIsUpdateRegionDisabled] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(0);
    const addUserForm = useRef();
    const updateUserForm = useRef();

    const setUsersByRoleType = usersFromApi => {
        const {role: {roleType}, region} = JSON.parse(localStorage.getItem("token"));
        const roleTypeMap = {
            1: "superAdmin",
            2: "admin",
            3: "editor"
        }
        if (roleTypeMap[roleType] !== "superAdmin") {
            setUsers(usersFromApi.filter(user => roleTypeMap[user.role.roleType] !== "superAdmin" && user.region === region))
        } else {
            setUsers(usersFromApi)
        }
    };

    useEffect(() => {
        axios.get("/users?_expand=role").then(res => {
            setUsersByRoleType(res.data);
        })
    }, []);

    useEffect(() => {
        axios.get("/regions").then(res => {
            setRegions(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get("/roles").then(res => {
            setRoles(res.data);
        })
    }, [])

    function deleteItem(item) {
        setUsers(users.filter(user => user.id !== item.id))
        axios.delete(`/users/${item.id}`)
    }

    function showConfirm(item) {
        confirm({
            title: 'Do you want to delete these items?',
            icon: <ExclamationCircleOutlined/>,

            onOk() {
                deleteItem(item);
                console.log('OK');
            },

            onCancel() {
                console.log('Cancel');
            },
        });
    }

    const onUpdateModalCancel = () => {
        setUpdateModalOpen(false);
        setIsUpdateRegionDisabled(!isUpdateRegionDisabled)
    }

    const switchRoleStatus = (user) => {
        user.roleState = !user.roleState;
        setUsers([...users])
        axios.patch(`/users/${user.id}`, {
            roleState: user.roleState
        })
    };

    async function handleUpdateModalOpen(user) {
        console.log(user);
        //setState 是非同步的 必須setState完才會重新render
        await setUpdateModalOpen(true);
        //TODO:Refactor use Enum 如果是超級管理員 
        if (user.role.id === 1) {
            setIsUpdateRegionDisabled(true)
        } else {

            setIsUpdateRegionDisabled(false)
        }
        updateUserForm.current.setFieldsValue(user)
        setCurrentUserId(user.id);
    }

    const columns = [{
        title: "區域",
        dataIndex: "region",
        filters: [...regions.map(region => ({
            text: region.label,
            value: region.value
        })), {
            text: "全球",
            value: ""
        }],
        "onFilter": (value, user) => {
            return user.region === value
        },
        render: (region) => {
            return <b>{region === "" ? "全球" : region}</b>
        }
    },

        {
            "title": "角色名稱",
            "dataIndex": "role",
            render: (role) => {
                return <b>{role.roleName}</b>;
            }
        },

        {
            "title": "用戶名",
            "dataIndex": "username",
        }, {
            "title": "用戶狀態",
            "dataIndex": "roleState",
            render: (roleState, user) => {
                return <Switch disabled={user.default} checked={roleState} onChange={() => switchRoleStatus(user)}/>;
            }
        }, {
            "title": "操作",
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined/>} disabled={item.default}
                            onClick={() => showConfirm(item)}/>
                    <Button type="primary" shape="circle" icon={<EditOutlined/>} disabled={item.default}
                            onClick={() => handleUpdateModalOpen(item)}/>
                </div>
            }
        },]

    const addFormOk = () => {
        addUserForm.current.validateFields().then(value => {
            setAddModalOpen(false)
            addUserForm.current.resetFields();
            axios.post("/users", {
                ...value,
                "default": false,
                "roleState": true
            }).then(res => {
                setUsers([...users, {
                    ...res.data,
                    role: roles.filter(role => role.id === value.roleId)[0]
                }])
            })
        }).catch(error => {
            console.log(error);
        })
        console.log("OK");
    };

    const updateFormOk = () => {
        updateUserForm.current.validateFields().then(value => {
            console.log(value);
            axios.patch(`/users/${currentUserId}`, value).then(res => {
                axios.get("/users?_expand=role").then(res => {
                    setUsersByRoleType(res.data)
                })
            })
        })
        setUpdateModalOpen(false)
        console.log("update");
    };

    return (<div>
        <Button type="primary" onClick={() => {
            setAddModalOpen(true)
        }}>新增用戶</Button>
        <Table dataSource={users} columns={columns}
               pagination={{pageSize: 5}}
               rowKey={(item) => item.id}/>
        <Modal
            open={addModalOpen}
            title="新增用戶"
            okText="Create"
            cancelText="Cancel"
            onCancel={() => setAddModalOpen(false)}
            onOk={addFormOk}
        >
            <UserForm ref={addUserForm} regions={regions} roles={roles}></UserForm>
        </Modal>
        <Modal
            open={updateModalOpen}
            title="修改用戶"
            okText="Update"
            cancelText="Cancel"
            onCancel={onUpdateModalCancel}
            onOk={updateFormOk}
        >
            <UserForm ref={updateUserForm} regions={regions} roles={roles}
                      isUpdateRegionDisabled={isUpdateRegionDisabled}></UserForm>
        </Modal>
    </div>)
}
