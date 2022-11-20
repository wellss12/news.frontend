import React, {useEffect, useState} from "react";
import {Button} from "antd";
import axios from 'axios';

const ajax = () => {
    // axios.get("http://localhost:8000/posts").then(res => {
    //     console.log(res.data)
    // })   

    // axios.post("http://localhost:8000/posts", {
    //     title: "TEST",
    //     author: "TEST1"
    // });

    // axios.put("http://localhost:8000/posts/2",{
    //     title:"all updated"
    // })

    // axios.patch("http://localhost:8000/posts/2", {
    //     title: "patched"
    // })

    // axios.delete("http://localhost:8000/posts/2")

    axios.get("http://localhost:8000/posts?_embed=comments").then(res => {
        console.log(res.data);
    })

    axios.get("http://localhost:8000/comments?_expand=post").then(res => {
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