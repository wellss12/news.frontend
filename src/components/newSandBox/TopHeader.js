import {Avatar, Dropdown, Layout, Menu} from 'antd';
import React, {useState} from "react";
import {
    MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined
} from '@ant-design/icons';
import {useNavigate} from "react-router-dom";

const {Header} = Layout;


export function TopHeader() {
    const navigate = useNavigate();
    const {role: {roleName}, username} = JSON.parse(localStorage.getItem("token"));
    const menu = (<Menu
        items={[{
            key: '1',
            label: roleName,
        }, {
            key: '2',
            danger: true,
            label: 'Logout',
            onClick: () => {
                localStorage.removeItem("token");
                navigate("/login", {replace: true})
            }
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
                歡迎 <span style={{color:"#1890ff"}}>{username}</span>回來
            </span>
            <Dropdown overlay={menu}>
                <Avatar size="large" icon={<UserOutlined/>}/>
            </Dropdown>
        </div>
    </Header>
}