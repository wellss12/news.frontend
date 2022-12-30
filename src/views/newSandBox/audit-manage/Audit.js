import React, {useEffect, useState} from 'react';
import {Button, message, notification, Table} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import axios from "axios";

export default function Audit(props) {
    const [newsList, setNewsList] = useState([]);
    useEffect(() => {
        axios(`/news?auditState=1&_expand=category`).then(res => {
            setNewsByRoleType(res.data)
        })
    }, []);
    const setNewsByRoleType = newsListFromApi => {
        const {role: {roleType}, region} = JSON.parse(localStorage.getItem("token"));
        const roleTypeMap = {
            1: "superAdmin",
            2: "admin",
            3: "editor"
        }
        if (roleTypeMap[roleType] !== "superAdmin") {
            setNewsList(newsListFromApi.filter(news => roleTypeMap[news.roleId] !== "superAdmin" && news.region === region))
        } else {
            setNewsList(newsListFromApi)
        }
    };

    const approveNews = newsId => {
        axios.patch(`/news/${newsId}`, {
            //已通過
            auditState: 2,
            //待發佈
            publishState: 1
        }).then(res => {
            setNewsList(newsList.filter(news => news.id !== newsId))
            notification.info({
                message: `通知`,
                description: `審核通過,可以到審核列表查看你的新聞狀態`,
                placement: "bottomRight",
            })
        })
    };

    const rejectNews = newsId => {
        axios.patch(`/news/${newsId}`, {
            //未通過
            auditState: 3,
            //未發佈
            publishState: 0
        }).then(res => {
            setNewsList(newsList.filter(news => news.id !== newsId))
            notification.info({
                message: `通知`,
                description: `審核拒絕,可以到審核列表查看你的新聞狀態`,
                placement: "bottomRight",
            })
        })
    };

    const columns = [
        {
            title: "新聞標題",
            dataIndex: "title",
            render: (title, news) => <a href={`#/news-manage/preview/${news.id}`}>{title}</a>
        },
        {
            title: "作者",
            dataIndex: "author",
        },
        {
            title: "新聞分類",
            dataIndex: "category",
            render: (category) => category.name
        },
        {
            title: "操作",
            render: (news) => {
                return <div>
                    <Button type="primary" shape="circle" icon={<CheckOutlined/>} onClick={() => approveNews(news.id)}/>
                    <Button danger shape="circle" icon={<CloseOutlined/>} onClick={() => rejectNews(news.id)}/>
                </div>

            },
        },]

    return (
        <div>
            <Table
                dataSource={newsList}
                columns={columns}
                rowKey={(item) => {
                    return item.id;
                }}>
            </Table>
        </div>
    );
};
