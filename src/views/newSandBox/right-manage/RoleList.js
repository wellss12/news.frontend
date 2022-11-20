import React, {useEffect, useState} from "react";
import {Button, Popover, Switch, Table, Modal, Tree} from "antd";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import axios from "axios";

const {confirm} = Modal;

export function RoleList() {
    const [roles, setRoles] = useState([]);
    const [rights, setRights] = useState([]);
    const [currentRights, setCurrentRights] = useState([]);
    const [currentRoleId, setCurrentRoleId] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        axios.get(`/roles`).then(res => {
            setRoles(res.data);
        })
    }, [])
    
    useEffect(()=>{
       axios.get(`/rights?_embed=children`) .then(res=>{
           setRights(res.data)
       })
    },[])

    function deleteItem(item) {
        //TODO IsDeleted
        setRoles(roles.filter(role => role.id !== item.id));
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


    const columns = [{
        title: "Id",
        dataIndex: "id",
        render: (id) => {
            return <b>{id}</b>;
        },
    }, {
        title: "角色名稱",
        dataIndex: "roleName",
    }, {
        title: "操作",
        render: (item) => {
            return <div>
                <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => showConfirm(item)}/>
                <Button type="primary" shape="circle" icon={<EditOutlined/>} onClick={()=>showModal(item)}/>
            </div>

        },
    },]

    function handleOk() {
        setIsModalOpen(false)
        setRoles(roles.map(role => {
            if (role.id === currentRoleId) {
                return {
                    ...role,
                    rights:currentRights
                }
            }
            return role;
        }))   
        
        axios.patch(`/roles/${currentRoleId}`,{
            rights:currentRights
        })
    }

    function handleCancel() {
        setIsModalOpen(false)
    }

    function showModal(item) {
        setCurrentRights(item.rights)
        setCurrentRoleId(item.id)
        setIsModalOpen(true)
    }

    const onCheck = (checkedKeys)=>{
        console.log(checkedKeys);
        setCurrentRights(checkedKeys.checked)
    }

    return <div>
        <Table
            dataSource={roles}
            columns={columns}
            rowKey={(item) => {
                return item.id;
            }}>
        </Table>
        <Modal title="權限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Tree
                checkable
                checkStrictly={true}
                checkedKeys={currentRights}
                treeData={rights}
                fieldNames={{title:"label"}}
                onCheck = {onCheck}
            />
        </Modal>
    </div>
}