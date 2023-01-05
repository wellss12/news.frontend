import React, {useEffect, useState} from 'react';
import {Descriptions, PageHeader} from "antd";
import axios from "axios";
import {useParams} from "react-router-dom";
import moment from "moment";
import {HeartTwoTone} from "@ant-design/icons";

export default function NewsDetail(props) {
    const {id} = useParams();
    const [newsInfo, setNewsInfo] = useState();

    useEffect(() => {
        axios.get(`/news/${id}?_expand=category`).then(res => {
            setNewsInfo(res.data);
            return res.data;
        }).then(news => {
            let newView = news.view + 1;
            axios.patch(`/news/${id}?_expand=category`, {
                view: newView
            })
            setNewsInfo({...news, view: newView})
        })
    }, []);

    const addStar = () => {
        let newStar = newsInfo.star + 1;
        axios.patch(`/news/${id}?_expand=category`, {
            star: newStar
        }).then(_ => {
            setNewsInfo({...newsInfo, star: newStar})
        })
    }
    return (
        newsInfo &&
        <div>
            <PageHeader
                onBack={() => window.history.back()}
                title={newsInfo.title}
                subTitle={<div>
                    {newsInfo.category.name}
                    <HeartTwoTone twoToneColor="#eb2f96" onClick={addStar}/>
                </div>}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="創建者">{newsInfo.author}</Descriptions.Item>
                    <Descriptions.Item label="發佈時間">
                        {newsInfo.publishTime ? moment(newsInfo.publishTime).format() : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="區域">{newsInfo.region}</Descriptions.Item>
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
