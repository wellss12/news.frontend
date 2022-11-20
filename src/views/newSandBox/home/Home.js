import React, {useEffect, useState} from "react";
import {Button} from "antd";
import axios from 'axios';

const ajax = () => {
    // axios.get("/posts").then(res => {
    //     console.log(res.data)
    // })   

    // axios.post("/posts", {
    //     title: "TEST",
    //     author: "TEST1"
    // });

    // axios.put("/posts/2",{
    //     title:"all updated"
    // })

    // axios.patch("/posts/2", {
    //     title: "patched"
    // })

    // axios.delete("/posts/2")

    axios.get("/posts?_embed=comments").then(res => {
        console.log(res.data);
    })

    axios.get("/comments?_expand=post").then(res => {
        console.log(res.data);
    })
};

export function Home() {
    const [mockData, setMockData] = useState([]);

    return <div className="AAA">
        Home
        <Button type="primary" onClick={ajax}>Button</Button>
    </div>
}