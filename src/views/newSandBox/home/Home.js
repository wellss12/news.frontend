import React, {useEffect, useRef, useState} from "react";
import {Avatar, Card, Col, Drawer, List, Row} from "antd";
import {EditOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";
import axios from "axios";
import * as echarts from "echarts";
import _ from 'lodash';

const {Meta} = Card;

export function Home() {
    const [views, setViews] = useState([]);
    const [stars, setStars] = useState([]);
    const [open, setOpen] = useState(false);
    const [pieChart, setPieChart] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const {username, region, role: {roleName}} = JSON.parse(localStorage.getItem("token"));
    
    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6").then(res => {
            setViews(res.data)
        })
    }, []);

    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6").then(res => {
            setStars(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category").then(res => {
            renderBarChart(_.groupBy(res.data, item => item.category.name));
            
            let currentUserData = res.data.filter(item => item.author === username);
            let groupedData = _.groupBy(currentUserData, item => item.category.name);
            console.log(groupedData);
            let pieChartData = [];
            for (let key in groupedData) {
                pieChartData.push({
                    name:key,
                    value:groupedData[key].length
                })
            }

            setPieChartData(pieChartData)
        })

        return () => {
            window.onresize = null;
        }
    }, [])

    const barChartRef = useRef();
    const renderBarChart = (obj) => {
        let myChart = echarts.init(barChartRef.current);

        // 指定圖表的配置項和數據
        let option = {
            title: {
                text: '新聞分類圖'
            },
            tooltip: {},
            legend: {
                data: ['數量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    interval: 0,
                    rotate: 45
                }
            },
            yAxis: {
                minInterval: 1
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

    const pieChartRef = useRef();
    const renderPieChart = () => {
        let myChart;
        if (pieChart === null) {
            myChart = echarts.init(pieChartRef.current);
            setPieChart(myChart);
        } else {
            myChart = pieChart;
        }

        let option;
        option = {
            title: {
                text: '當前用戶新聞分類圖示',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: pieChartData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);
    }


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
                        <SettingOutlined key="setting" onClick={async () => {
                            await setOpen(true)
                            renderPieChart()
                        }}/>,
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
                                <span style={{paddingLeft: 30}}>
                                {roleName}
                            </span>
                            </div>
                        }
                    />
                </Card></Col>
        </Row>
        <Drawer title="個人新聞圖示統計" placement="right" width="500px" onClose={() => setOpen(false)} open={open}>
            <div style={{height: "400px", width: "100%", marginTop: "30px"}} ref={pieChartRef}></div>
        </Drawer>
        <div ref={barChartRef} style={{height: "400px", width: "100%", marginTop: "30px"}}></div>
    </div>;
}