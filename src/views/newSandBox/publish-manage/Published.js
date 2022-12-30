import React from 'react';
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import useNews from "../../../components/publish-manage/useNews";
import {Button} from "antd";

export default function Published() {
    const {newsList, sunset} = useNews(2);

    return (
        <div>
            <NewsPublish newsList={newsList}
                         button={(id) => <Button danger onClick={() => sunset(id)}>下線</Button>}/>
        </div>
    );
}
