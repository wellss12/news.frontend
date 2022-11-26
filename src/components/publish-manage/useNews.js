import React, {useEffect, useState} from 'react';
import axios from "axios";
import {notification} from "antd";

const useNews = (auditState) => {
    const [newsList, setNewsList] = useState([]);
    const {username} = JSON.parse(localStorage.getItem("token"));
    useEffect(() => {
        axios(`/news?author=${username}&publishState=${auditState}&_expand=category`).then(res => {
            setNewsList(res.data)
        })
    }, [])

    const publish = (id) => {
        axios.patch(`/news/${id}`, {
            publishState: 2,
            publishTime: Date.now()
        }).then(() => {
            setNewsList(newsList.filter(news => news.id !== id))
            notification.info({
                message: `通知`,
                description: `可以在 [發布管理/已發布] 中查看你的新聞`,
                placement: "bottomRight",
            });
        })
    }

    const sunset = (id) => {
        axios.patch(`/news/${id}`, {
            publishState: 3,
        }).then(() => {
            setNewsList(newsList.filter(news => news.id !== id));
            notification.info({
                message: `通知`,
                description: `可以在 [發布管理/已下線] 中查看你的新聞`,
                placement: "bottomRight",
            });

        })
    };

    const remove = (id) => {
        axios.delete(`/news/${id}`).then(() => {
            setNewsList(newsList.filter(news => news.id !== id));
            notification.info({
                message: `通知`,
                description: `你已經刪除已下線的新聞`,
                placement: "bottomRight",
            });

        })
    }


    return {
        newsList,
        publish,
        sunset,
        remove
    }
};

export default useNews

