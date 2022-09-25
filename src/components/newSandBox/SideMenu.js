import {Layout, Menu} from 'antd';
import {
    UserOutlined,
} from '@ant-design/icons';
import "./SideMenu.css"
import {useNavigate} from "react-router-dom";

const menuList = [
    {
        key:"/home",
        label:"首頁",
        icon:<UserOutlined />
    },
    {
        key:"/user-manage",
        label:"用戶管理",
        icon:<UserOutlined />,
        children:[
            {
                key:"/user-manage/user/list",
                label:"用戶列表",
                icon:<UserOutlined/>
            }
        ]
    },
    {
        key:"/right-manage",
        label:"權限管理",
        icon:<UserOutlined />,
        children:[
            {
                key:"/right-manage/role/list",
                label:"角色列表",
                icon:<UserOutlined/>
            },
            {
                key:"/right-manage/right/list",
                label:"權限列表",
                icon:<UserOutlined/>
            },
        ]
    }
]
const {Sider} = Layout;
export function SideMenu() {
    const navigate = useNavigate();
    const onClick = (e)=>{
        console.log(e.key);
        navigate(e.key);
    }
    return <Sider trigger={null} collapsible  collapsed={false}>
        <div className="logo">全球新聞發布管理系統</div>
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={menuList}
            onClick={onClick}
        />
    </Sider>
}