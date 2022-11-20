import React, {useEffect, useState} from 'react';
import {Button, Table, Modal, notification} from 'antd';
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UploadOutlined} from "@ant-design/icons";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const {confirm} = Modal;


export default function NewsDraft(props) {
    const [newsList, setNewsList] = useState();
    const user = JSON.parse(localStorage.getItem("token"));
    const navigate = useNavigate();


    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            render: (id) => <b>{id}</b>,
        },
        {
            title: '新聞標題',
            dataIndex: 'title',
            render: (title, item) => {
                //Todo: Why add '#' in path
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新聞分類',
            dataIndex: 'category',
            render: (category) => {
                return category.name
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (news) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined/>}
                            onClick={() => showConfirm(news.id)}></Button>
                    <Button shape="circle" icon={<EditOutlined/>}
                            onClick={() => navigate(`/news-manage/update/${news.id}`)}></Button>
                    <Button type="primary" shape="circle" icon={<UploadOutlined/>}
                            onClick={() => submitForReview(news.id)}></Button>
                </div>
            }
        },
    ];

    useEffect(() => {
        axios.get(`http://localhost:8000/news?author=${user.username}&&auditState=${0}&&_expand=category`)
            .then(res => {
                setNewsList(res.data)
            })
    }, [])

    const submitForReview = (newsId) => {
        axios.patch(`http://localhost:8000/news/${newsId}`, {
            auditState: 1
        }).then(res =>{
            navigate(`/audit-manage/list`);
            notification.info({
                message: `通知`,
                description: `可以在審核列表中查看你的新聞`,
                placement: "bottomRight",
            });
        })
    };

    const deleteItem = newsId => {
        axios.delete(`http://localhost:8000/news/${newsId}`).then(res => {
            setNewsList(newsList.filter(news => news.id !== newsId))
        })
    };

    const showConfirm = newsId => {
        confirm({
            title: 'Do you want to delete these items?',
            icon: <ExclamationCircleOutlined/>,
            onOk() {
                deleteItem(newsId);
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    return <Table columns={columns} dataSource={newsList} rowKey={(news) => news.id}/>
}
