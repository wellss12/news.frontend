import {Avatar, Dropdown, Layout, Menu} from 'antd';
import React, {useState} from "react";
import {
    MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined
} from '@ant-design/icons';

const {Header} = Layout;


export function TopHeader() {
    const menu = (<Menu
        items={[{
            key: '1',
            label: ("超級管理員"),
        }, {
            key: '2',
            danger: true,
            label: 'Logout',
        },]}
    />);

    const ChangeCollapsed = () => {
        setCollapsed(!collapsed);
    };
    const [collapsed, setCollapsed] = useState(false);
    return <Header
        className="site-layout-background"
        style={{
            padding: "0px 16px"
        }}
    >
        {collapsed ? <MenuUnfoldOutlined onClick={ChangeCollapsed}/> : <MenuFoldOutlined onClick={ChangeCollapsed}/>}
        <div style={{float: "right"}}>
            <span>
                歡迎Admin回來
            </span>
            <Dropdown overlay={menu}>
                <Avatar size="large" icon={<UserOutlined/>}/>
            </Dropdown>
        </div>
    </Header>
}