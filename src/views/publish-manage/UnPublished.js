import React from "react";
import NewsPublish from "../../components/publish-manage/NewsPublish";
import useNews from "../../components/publish-manage/useNews";

export default function UnPublished() {
    const {newsList} = useNews(1);

    return <div>
        <NewsPublish newsList={newsList}></NewsPublish>
    </div>
}