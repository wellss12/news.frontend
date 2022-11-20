import React, {useEffect, useState} from 'react';
import {Button, notification, Table, Tag} from "antd";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function AuditList(props) {
    const {username} = JSON.parse(localStorage.getItem("token"));
    const [newsList, setNewsList] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios(`http://localhost:8000/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`)
            .then(res => {
                setNewsList(res.data)
            })
    }, [])
    const auditStateMap = {
        0: "未審核",
        1: "審核中",
        2: "已通過",
        3: "未通過"
    };
    const auditColorMap = {
        0: "",
        1: "orange",
        2: "green",
        3: "red"
    }

    const revertNews = (newsId) => {
        axios.patch(`http://localhost:8000/news/${newsId}`, {
            auditState: 0
        }).then(res => {
            setNewsList(newsList.filter(news => news.id !== newsId))
            notification.info({
                message: `通知`,
                description: `可以在草稿箱中查看你的新聞`,
                placement: "bottomRight",
            })
        })
    };

    const publishNews = (newsId) => {
        axios.patch(`http://localhost:8000/news/${newsId}`, {
            publishState: 2,
            publishTime: Date.now()
        }).then(res => {
            setNewsList(newsList.filter(news => news.id !== newsId))
            notification.info({
                message: `通知`,
                description: `可以在 [審核管理/已發佈] 查看你的新聞`,
                placement: "bottomRight"
            })
        })
    };

    const updateNews = (newId) => {
        navigate(`/news-manage/preview/${newId}`)
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
            title: "審核狀態",
            dataIndex: "auditState",
            render: (auditState) => <Tag color={auditColorMap[auditState]}>{auditStateMap[auditState]}</Tag>
        },
        {
            title: "操作",
            render: (news) => {
                return <div>
                    {
                        news.auditState === 1 && <Button onClick={() => revertNews(news.id)}>撤銷</Button>
                    }
                    {
                        news.auditState === 2 && <Button danger onClick={() => publishNews(news.id)}>發佈</Button>
                    }
                    {
                        news.auditState === 3 && <Button type="primary" onClick={() => updateNews(news.id)}>更新</Button>
                    }
                </div>

            },
        },]


    return (
        <div>
            <Table
                dataSource={newsList}
                columns={columns}
                pagination={{pageSize: 5}}
                rowKey={(news) => {
                    return news.id;
                }}>
            </Table>
        </div>
    );
};
