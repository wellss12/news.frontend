import {Avatar, Dropdown, Layout, Menu} from 'antd';
import React from "react";
import {
    MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined
} from '@ant-design/icons';
import {useNavigate} from "react-router-dom";
import {connect} from "react-redux";

const {Header} = Layout;

function TopHeader(props) {
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
        props.changeCollapsed()
    };
    return <Header
        className="site-layout-background"
        style={{
            padding: "0px 16px"
        }}
    >
        {props.isCollapsed ? <MenuUnfoldOutlined onClick={ChangeCollapsed}/> :
            <MenuFoldOutlined onClick={ChangeCollapsed}/>}
        <div style={{float: "right"}}>
            <span>
                歡迎 <span style={{color: "#1890ff"}}>{username}</span>回來
            </span>
            <Dropdown overlay={menu}>
                <Avatar size="large" icon={<UserOutlined/>}/>
            </Dropdown>
        </div>
    </Header>
}

const mapStateToProps = ({CollapsedReducer: {isCollapsed}}) => {
    return {
        isCollapsed
    }
}

const mapDispatchToProps = {
    changeCollapsed: () => ({
        type: "change_collapsed"
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)