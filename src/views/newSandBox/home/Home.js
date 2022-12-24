import React, {useEffect, useRef, useState} from "react";
import {Avatar, Card, Col, List, Row} from "antd";
import {EditOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";
import axios from "axios";
import * as echarts from "echarts";
import _ from 'lodash';

const {Meta} = Card;
export function Home() {
    const [views, setViews] = useState([]);
    const [stars, setStars] = useState([]);
    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res => {
            setViews(res.data)
        })
    }, []);
    
    useEffect(()=>{
        axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res =>{
            setStars(res.data)
        })
    },[])
    
    const barChartRef = useRef();

    useEffect(()=>{
        axios.get("/news?publishState=2&_expand=category").then(res => {
            renderBarChart(_.groupBy(res.data, item => item.category.name));
        }, [])

        return () => {
            window.onresize = null;
        }
    },[])

    const renderBarChart = (obj) => {
        var myChart = echarts.init(barChartRef.current);

        // 指定圖表的配置項和數據
        var option = {
            title: {
                text: '新聞分類圖'
            },
            tooltip: {},
            legend: {
                data: ['數量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel:{
                    interval:0,
                    rotate:45
                }
            },
            yAxis: {
                minInterval:1
            },
            series: [
                {
                    name: '數量',
                    type: 'bar',
                    data: Object.values(obj).map(item => item.length)
                }
            ]
        };

        // 使用剛指定的配置項和數據顯示圖表
        myChart.setOption(option);
        
        window.onresize = () => {
            myChart.resize();
        };
    };

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
        <div ref={barChartRef} style={{height: "400px", width: "100%", marginTop:"50px"}}></div>
    </div>;
}