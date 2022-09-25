import {useRoutes} from "react-router-dom";
import React from 'react';
import {Login} from "../views/login/Login";
import {NewSandBox} from "../views/newSandBox/NewSandBox";
import Redirect from "../components/Redirect";
import {Home} from "../views/newSandBox/home/Home";
import {RightList} from "../views/newSandBox/right-manage/RightList";
import {RoleList} from "../views/newSandBox/right-manage/RoleList";
import {UserList} from "../views/newSandBox/user-manage/UserList";
import {NoPermission} from "../views/newSandBox/noPermission/NoPermission";


export default function IndexRouter(props) {
    return useRoutes([
        {
            path: "/",
            element: <AuthComponent>
                <NewSandBox/>
            </AuthComponent>,
            children: [
                {
                    path: "",
                    element: <Redirect to="/home"/>
                },
                {
                    path: "/home",
                    element: <Home/>
                },
                {
                    path: "/right-manage/right/list",
                    element: <RightList/>
                },
                {
                    path: "/right-manage/role/list",
                    element: <RoleList/>
                },
                {
                    path: "/user-manage/user/list",
                    element: <UserList/>
                },
                {
                    path: "*",
                    element: <NoPermission/>
                }
            ]
        },
        {
            path: "/login",
            element: <Login></Login>
        },
    ])
}

function AuthComponent({children}) {
    return localStorage.getItem("token")
        ? children
        : <Redirect to="/login"/>;
}
