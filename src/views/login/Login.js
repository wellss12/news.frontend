import React, {useCallback} from "react";
import {Button, Form, Input, message} from "antd";
import "./Login.css"
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import Particles from "react-particles";
import {loadFull} from "tsparticles";
import axios from "axios";
import {json, useNavigate} from "react-router-dom";

export function Login() {
    const particlesInit = useCallback(async engine => {
        console.log(engine);
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async container => {
        await console.log(container);
    }, []);

    const navigate = useNavigate();

    const onFinish = (values) => {
        axios.get(`http://localhost:8000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
            .then(res => {
                if (res.data.length !== 1) {
                    message.error("帳號或密碼錯誤")
                } else {
                    localStorage.setItem("token", JSON.stringify(res.data[0]));
                    navigate("/");
                }
            })
    }
    return (<div style={{background: 'rgb(35,39,65)', height: "100%"}}>
        <Particles id="tsparticles" init={particlesInit} loaded={particlesLoaded}/>
        <div className="formContainer">
            <div className="formTitle">
                全球新聞發佈管理系統
            </div>
            <Form
                name="normal_login"
                className="login-form"
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{
                        required: true, message: 'Please input your Username!',
                    },]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{
                        required: true, message: 'Please input your Password!',
                    },]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon"/>}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                </Form.Item>
            </Form></div>
    </div>)
}