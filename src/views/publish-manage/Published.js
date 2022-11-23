import React, {useEffect, useState} from 'react';
import NewsPublish from "../../components/publish-manage/NewsPublish";
import axios from "axios";

export default function Published(props) {
    const [newsList, setNewsList] = useState([]);
    const {username} = JSON.parse(localStorage.getItem("token"));
    useEffect(() => {
        axios(`/news?author=${username}&publishState=2&_expand=category`).then(res => {
            setNewsList(res.data)
        })
    })
    return (
        <div>
            <NewsPublish newsList={newsList}/>
        </div>
    );
}
