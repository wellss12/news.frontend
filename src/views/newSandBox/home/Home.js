import React, {useEffect, useState} from "react";
import {Avatar, Button, Card, Col, List, Row} from "antd";
import {EditOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";
import axios from "axios";

const {Meta} = Card;

export function Home() {
    const [views, setViews] = useState([]);
    const [stars, setStars] = useState([]);
    useEffect(()=>{
        axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res =>{
            setViews(res.data)
        })
    },[])
    useEffect(()=>{
        axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res =>{
            setStars(res.data)
        })
    },[])

    const {username, region, role: {roleName}} = JSON.parse(localStorage.getItem("token"));

    return <div>
        <Row gutter={16}>
            <Col span={8}>
                <Card title="用戶最常瀏覽" bordered={true}>
                    <List
                        bordered
                        dataSource={views}
                        renderItem={(item) => (
                            <List.Item>
                                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card title="用戶點讚最多" bordered={true}>
                    <List
                        bordered
                        dataSource={stars}
                        renderItem={(item) => (
                            <List.Item>
                                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                            </List.Item>
                        )}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card
                    cover={
                        <img
                            alt="example"
                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        />
                    }
                    actions={[
                        <SettingOutlined key="setting"/>,
                        <EditOutlined key="edit"/>,
                        <EllipsisOutlined key="ellipsis"/>,
                    ]}
                >
                    <Meta
                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random"/>}
                        title={username}
                        description={
                        <div>
                            <b>{region ? region : "全球"}</b>
                            <span style={{paddingLeft:30}}>
                                {roleName}
                            </span>
                        </div>
                        }
                    />
                </Card></Col>
        </Row>
    </div>;
}