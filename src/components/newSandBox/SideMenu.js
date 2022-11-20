import {Layout, Menu} from 'antd';
import {
    UserOutlined,
} from '@ant-design/icons';
import "./SideMenu.css"
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import axios from "axios";

const {Sider} = Layout;
const iconList = {
    "/home": <UserOutlined/>,
    "/user-manage/list": <UserOutlined/>,
    "/right-manage/role/list": <UserOutlined/>,
    "/right-manage/right/list": <UserOutlined/>,
}

export function SideMenu() {
    const [menuList, setMenuList] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:8000/rights?_embed=children").then(res => {
            setMenuList(res.data);
        })
    }, [])

    const navigate = useNavigate();
    const onClick = (e) => {
        console.log(e.key);
        navigate(e.key);
    }

    function NotExistChildren(menu) {
        return menu.children?.length === 0;

    }
    
    const rights = JSON.parse(localStorage.getItem("token")).role.rights;
    const includePagePermissionMenu = useMemo(() => {
        console.log(menuList);
        return menuList.filter((menu) => {
            if (menu.pagepermission === 1 && rights.includes(menu.key)) {
                if (NotExistChildren(menu)) {
                    menu.children = null;
                } else {
                    menu.children = menu.children?.filter(child => child.pagepermission === 1)
                }
                return menu;
            }
        });
    }, [menuList])

    const location = useLocation();
    const selectedKeys = location.pathname;
    const openKeys = '/' + selectedKeys.split('/')[1];

    //default開頭的是非受控 => 狀態只有第一個會修改,所以輸入/,會先更新為/,最後重定向到home時,不會再改變
    return <Sider trigger={null} collapsible collapsed={false}>
        <div style={{display: "flex", height: "100%", flexDirection: "column"}}>
            <div className="logo">全球新聞發布管理系統</div>
            <div style={{flex: 2, overflow: "auto"}}>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[selectedKeys]}
                    defaultOpenKeys={[openKeys]}
                    expandIcon={iconList[{}]}
                    items={includePagePermissionMenu}
                    onClick={onClick}
                /></div>
        </div>
    </Sider>
}