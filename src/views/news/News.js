import React, {useEffect, useState} from 'react';
import {Card, Col, List, PageHeader, Row} from "antd";
import axios from "axios";
import _ from 'lodash';

export default function News() {
    const [categoryMapNewsList, setCategoryMapNewsList] = useState([]);
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category').then(res => {
            setCategoryMapNewsList(Object.entries(_.groupBy(res.data, news => news.category.name)))
        })
    }, [])
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="全球大新聞"
                subTitle="查看新聞"
            />
            <div className="site-card-wrapper" style={{width: "95%", margin: "0 auto"}}>
                <Row gutter={[16, 16]}>
                    {
                        categoryMapNewsList.map(data => {
                            let categoryName = data[0];
                            let newsList = data[1];
                            return <Col key={categoryName} span={8}>
                                <Card key={categoryName} title={categoryName} bordered={true} hoverable={true}>
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={newsList}
                                        pagination={{
                                            pageSize: 3
                                        }}
                                        renderItem={(news) => (
                                            <List.Item key={news.id}>
                                                <a href={`#/news/detail/${news.id}`}>{news.title}</a>
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Col>
                        })
                    }
                </Row>
            </div>
        </div>

    );
}
