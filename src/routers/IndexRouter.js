﻿import {useRoutes} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import {Login} from "../views/login/Login";
import {NewSandBox} from "../views/newSandBox/NewSandBox";
import Redirect from "../components/Redirect";
import {Home} from "../views/newSandBox/home/Home";
import {RightList} from "../views/newSandBox/right-manage/RightList";
import {RoleList} from "../views/newSandBox/right-manage/RoleList";
import {UserList} from "../views/newSandBox/user-manage/UserList";
import {NoPermission} from "../views/newSandBox/noPermission/NoPermission";
import NewsAdd from "../views/news-manage/NewsAdd";
import NewsDraft from "../views/news-manage/NewsDraft";
import NewsCategory from "../views/news-manage/NewsCategory";
import Audit from "../views/audit-manage/Audit";
import AuditList from "../views/audit-manage/AuditList";
import UnPublished from "../views/publish-manage/UnPublished";
import Published from "../views/publish-manage/Published";
import Sunset from "../views/publish-manage/Sunset";
import axios from "axios";
import NewsPreview from "../views/news-manage/NewsPreview";
import NewsUpdate from "../views/news-manage/NewsUpdate";

const routersMap = {
    "/home": <Home/>,
    "right-mange/right/list": <RightList/>,
    "/right-manage/role/list": <RoleList/>,
    "/user-manage/list": <UserList/>,
    "/news-manage/add": <NewsAdd/>,
    "/news-manage/draft": <NewsDraft/>,
    "/news-manage/update:id":<NewsUpdate/>,
    "/news-manage/category": <NewsCategory/>,
    "/audit-manage/audit": <Audit/>,
    "/audit-manage/list": <AuditList/>,
    "/publish-manage/unpublished": <UnPublished/>,
    "/publish-manage/published": <Published/>,
    "/publish-manage/sunset": <Sunset/>,
}

export default function IndexRouter(props) {
    const [permissions, setPermissions] = useState([]);
    useEffect(() => {
        Promise.all([
            axios.get(`http://localhost:8000/rights`),
            axios.get(`http://localhost:8000/children`),
        ]).then(res => {
            setPermissions([...res[0].data, ...res[1].data])
        })
    }, [])

    //Todo:Refactor dynamic generate and verify permission
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
                    path: "/user-manage/list",
                    element: <UserList/>
                },
                {
                    path: "/news-manage/draft",
                    element: <NewsDraft/>
                },
                {
                    path: "/news-manage/add",
                    element: <NewsAdd/>
                },
                {
                    path: "/news-manage/update/:id",
                    element: <NewsUpdate/>
                },
                {
                    path: "/news-manage/preview/:id",
                    element: <NewsPreview/>
                },
                {
                    path: "/news-manage/category",
                    element: <NewsCategory/>
                },
                {
                    path: "/audit-manage/audit",
                    element: <Audit/>
                },
                {
                    path: "/audit-manage/list",
                    element: <AuditList/>
                },
                {
                    path: "/publish-manage/unpublished",
                    element: <UnPublished/>
                },
                {
                    path: "/publish-manage/published",
                    element: <Published/>
                },
                {
                    path: "/publish-manage/sunset",
                    element: <Sunset/>
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

const AuthComponent = ({children}) => {
    return localStorage.getItem("token")
        ? children
        : <Redirect to="/login"/>
};
