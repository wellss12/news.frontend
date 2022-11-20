import {Form, Input, Select} from "antd";
import React, {forwardRef, useEffect, useState} from "react";

const {Option} = Select;
const UserForm = forwardRef((props, ref) => {
    const {
        role: {roleType: currentUserRoleType},
        region: currentUserRegion
    } = JSON.parse(localStorage.getItem("token"));
    const roleTypeMap = {
        1: "superAdmin",
        2: "admin",
        3: "editor"
    };
    const [isRegionDisabled, setIsRegionDisabled] = useState(false);
    
    useEffect(() => {
        setIsRegionDisabled(props.isUpdateRegionDisabled)
    }, [props.isUpdateRegionDisabled])

    const checkRegionDisabled = region => {
        if (roleTypeMap[currentUserRoleType] === "superAdmin") {
            return false;
        } else {
            return region.value !== currentUserRegion;
        }
    };

    const isRoleDisabled = (roleType) => {
        if (roleTypeMap[currentUserRoleType] === "superAdmin") {
            return false;
        } else {
            return roleTypeMap[roleType] === "superAdmin";
        }
    };

    return <Form ref={ref} layout="vertical">
        <Form.Item
            name="username"
            label="用戶名"
            rules={[{
                required: true,
            },]}
        >
            <Input/>
        </Form.Item>
        <Form.Item
            name="password"
            label="密碼"
            rules={[{
                required: true,
            },]}
        >
            <Input/>
        </Form.Item>
        <Form.Item
            name="region"
            label="區域"
            rules={[{
                required: !isRegionDisabled
            }]}
        >
            <Select disabled={isRegionDisabled}
                    style={{
                        width: 120,
                    }}>
                {props.regions.map(region => {
                    return <Option disabled={checkRegionDisabled(region)} key={region.id}
                                   value={region.value}>{region.label}</Option>;
                })}
            </Select>
        </Form.Item>
        <Form.Item
            name="roleId"
            label="角色"
            rules={[{
                required: true,
            },]}
        >

            <Select onChange={(value) => {
                if (value === 1) {
                    setIsRegionDisabled(true)
                    ref.current.setFieldValue("region", "");
                } else {
                    setIsRegionDisabled(false)
                }
            }}
                    style={{
                        width: 120,
                    }}>
                {props.roles.map(role => {
                    return <Option disabled={isRoleDisabled(role.roleType)} key={role.id}
                                   value={role.id}>{role.roleName}</Option>;
                })}
            </Select>
        </Form.Item>
    </Form>
})

export {UserForm}