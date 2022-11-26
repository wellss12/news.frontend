import React from 'react';
import useNews from "../../components/publish-manage/useNews";
import NewsPublish from "../../components/publish-manage/NewsPublish";

export default function Sunset(props) {
    const {newsList} = useNews(3);
    
    return (
        <div>
            <NewsPublish newsList={newsList}/>
        </div>
    );
}
