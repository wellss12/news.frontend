import React from 'react';
import NewsPublish from "../../components/publish-manage/NewsPublish";
import useNews from "../../components/publish-manage/useNews";

export default function Published(props) {
    const {newsList} = useNews(2);
    
    return (
        <div>
            <NewsPublish newsList={newsList}/>
        </div>
    );
}
