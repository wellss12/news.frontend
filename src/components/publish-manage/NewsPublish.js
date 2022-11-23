import {Button, Table} from "antd";
import React from "react";

export default function NewsPublish(props) {
    const columns = [
        {
            title: "新聞標題",
            dataIndex: "title",
            render: (title, news) => {
                return <a href={`#/news-manage/preview/${news.id}`}>{title}</a>;
            },
        },
        {
            title: "作者",
            dataIndex: "author",
        },
        {
            title: "新聞分類",
            dataIndex: "category",
            render: (category) => category.name
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    <Button type="primary">發佈</Button>
                </div>

            },
        },]

    return (
        <div>
            <Table
                dataSource={props.newsList}
                columns={columns}
                rowKey={(item) => {
                    return item.id;
                }}>
            </Table>

        </div>
    );
}