import React, {useEffect, useState} from 'react';
import {Descriptions, PageHeader} from "antd";
import axios from "axios";
import {useParams} from "react-router-dom";
import moment from "moment";

export default function NewsPreview(props) {
    const {id} = useParams();
    const [newsInfo, setNewsInfo] = useState();
    const auditStateMap = {
        0: "未審核",
        1: "審核中",
        2: "已通過",
        3: "未通過"
    };
    const publishStateMap = {
        0: "未發佈",
        1: "待發佈",
        2: "已發佈",
        3: "已下線"
    };

    useEffect(() => {
        axios.get(`/news/${id}?_expand=category`).then(res => {
            setNewsInfo(res.data);
        })
    }, []);

    return (
        newsInfo &&
        <div>
            <PageHeader
                onBack={() => window.history.back()}
                title={newsInfo.title}
                subTitle={newsInfo.category.name}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="創建者">{newsInfo.author}</Descriptions.Item>
                    <Descriptions.Item label="創建時間">
                        {moment(newsInfo.createTitme).format("yyyy/MM/DD HH:mm:ss")}
                    </Descriptions.Item>
                    <Descriptions.Item label="發佈時間">
                        {newsInfo.publishTime ? newsInfo.publishTime : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="區域">{newsInfo.region}</Descriptions.Item>
                    <Descriptions.Item label="審核狀態" contentStyle={{color: "red"}}>
                        {auditStateMap[newsInfo.auditState]}
                    </Descriptions.Item>
                    <Descriptions.Item label="發佈狀態" contentStyle={{color: "red"}}>
                        {publishStateMap[newsInfo.publishState]}
                    </Descriptions.Item>
                    <Descriptions.Item label="訪問數量">{newsInfo.view}</Descriptions.Item>
                    <Descriptions.Item label="點讚數量">{newsInfo.star}</Descriptions.Item>
                    <Descriptions.Item label="評論數量">0</Descriptions.Item>
                </Descriptions>
            </PageHeader>

            <div dangerouslySetInnerHTML={{
                __html: newsInfo.content
            }} style={{
                margin: "0 24px",
                border: "1px solid gray"
            }}>
            </div>
        </div>
    );
}
