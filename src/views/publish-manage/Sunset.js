import React from 'react';
import useNews from "../../components/publish-manage/useNews";
import NewsPublish from "../../components/publish-manage/NewsPublish";
import {Button} from "antd";

export default function Sunset() {
    const {newsList, remove} = useNews(3);

    return (
        <div>
            <NewsPublish newsList={newsList}
                         button={(id) => <Button danger onClick={() => remove(id)}>移除</Button>}/>
        </div>
    );
}
