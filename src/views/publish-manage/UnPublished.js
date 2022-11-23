import React, {useEffect, useState} from "react";
import axios from "axios";
import NewsPublish from "../../components/publish-manage/NewsPublish";

export default function UnPublished() {
    const [newsList, setNewsList] = useState([]);
    const {username} = JSON.parse(localStorage.getItem("token"));
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=1&_expand=category`).then(res => {
            setNewsList(res.data);
        })
    }, [])


    return <div>
        <NewsPublish newsList={newsList}></NewsPublish>
    </div>
}