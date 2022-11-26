import React, {useEffect, useState} from 'react';
import axios from "axios";

const useNews = (auditState) => {
    const [newsList, setNewsList] = useState([]);
    const {username} = JSON.parse(localStorage.getItem("token"));
    useEffect(() => {
        axios(`/news?author=${username}&publishState=${auditState}&_expand=category`).then(res => {
            setNewsList(res.data)
        })
    }, [])

    return {
        newsList
    }
};

export default useNews

