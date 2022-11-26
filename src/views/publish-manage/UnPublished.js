import React from "react";
import NewsPublish from "../../components/publish-manage/NewsPublish";
import useNews from "../../components/publish-manage/useNews";
import {Button} from "antd";

export default function UnPublished() {
    const {newsList, publish} = useNews(1);

    return (
        <div>
            <NewsPublish newsList={newsList}
                         button={(id) => <Button type="primary" onClick={() => publish(id)}>發布</Button>}/>
        </div>
    )
}