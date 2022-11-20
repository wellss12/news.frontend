import React, {useEffect, useState} from "react";
import {Button, Table, Tag, Modal, Popover, Switch} from "antd";
import axios from "axios";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons";

const {confirm} = Modal;

export function RightList() {
    const [rights, setRights] = useState([]);
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            res.data.forEach(item => {
                if (item.children.length === 0) {
                    item.children = null;
                }
            })
            setRights(res.data)
        })
    }, []);

    function deleteItem(item) {
        //TODO IsDeleted
        if (item.grade === 1) {
            setRights(rights.filter(right => right.id !== item.id))
        } else {
            let filterRights = rights.filter(right => right.id === item.rightId);
            filterRights[0].children = filterRights[0].children.filter(child => child.id !== item.id);
            setRights([...rights])
        }
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

    const switchPageConfig = (item) => {
        item.pagepermission = item.pagepermission === 1 ? 0 : 1;
        setRights([...rights]);

        if (item.grade === 1) {
            axios.patch(`/rights/${item.id}`, {
                pagepermission: item.pagepermission
            })
        } else {
            axios.patch(`/children/${item.id}`, {
                pagepermission: item.pagepermission
            })
        }
    };

    const NoPagePermission = item => item.pagepermission === undefined;

    const columns = [
        {
            "title": "Id",
            "dataIndex": "id",
            render: (id) => {
                return <b>{id}</b>
            }
        },

        {
            "title": "權限名稱",
            "dataIndex": "label",
        },

        {
            "title": "權限路徑",
            "dataIndex": "key",
            render: (key) => {
                return <Tag color="orange">{key}</Tag>
            }
        },
        {
            "title": "操作",
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={() => showConfirm(item)}/>
                    <Popover content={<div style={{textAlign: "center"}}>
                        <Switch checked={item.pagepermission} onChange={() => switchPageConfig(item)}></Switch>
                    </div>} title="頁面配置" trigger={NoPagePermission(item) ? "" : "click"} enabled={false}>
                        <Button type="primary" shape="circle" icon={<EditOutlined/>}
                                disabled={NoPagePermission(item)}/>
                    </Popover>
                </div>
            }
        },
    ]
    return <Table dataSource={rights} columns={columns}
                  pagination={{pageSize: 5}}/>;
}
