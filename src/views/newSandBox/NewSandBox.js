import React from "react";
import {SideMenu} from "../../components/newSandBox/SideMenu";
import {TopHeader} from "../../components/newSandBox/TopHeader";
import {Outlet} from "react-router-dom";
import {Layout} from 'antd';
import "./NewSandBox.css"

const {Content} = Layout;

export function NewSandBox() {
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
                    overflow:"auto"
                }}
            >
                <Outlet/>
            </Content>
        </Layout>
    </Layout>
}