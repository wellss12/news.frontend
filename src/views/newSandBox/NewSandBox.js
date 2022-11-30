import React from "react";
import SideMenu from "../../components/newSandBox/SideMenu";
import TopHeader from "../../components/newSandBox/TopHeader";
import {Outlet} from "react-router-dom";
import {Layout, Spin} from 'antd';
import "./NewSandBox.css"
import {connect} from "react-redux";

const {Content} = Layout;

function NewSandBox(props) {
    return <Layout>
        <SideMenu></SideMenu>
        <Layout className="site-layout">
            <TopHeader></TopHeader>
            <Content
                className="site-layout-background"
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    overflow: "auto"
                }}
            >
                <Spin size="large" spinning={props.isLoading}>
                    <Outlet/>
                </Spin>
            </Content>
        </Layout>
    </Layout>
}

const mapStateToProps = ({LoadingReducer: {isLoading}}) => ({
    isLoading
})
export default connect(mapStateToProps)(NewSandBox)