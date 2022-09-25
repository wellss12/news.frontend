import React, {useEffect, useState} from "react";
import {Button} from "antd";
import axios from 'axios';

const ajax = () => {
    axios.get("http://localhost:8000/posts").then(res => {
        console.log(res.data)
    })
    axios.post("http://localhost:8000/posts", {
        "title": "ugly",
        "author": "DDD"
    });
}

export function Home() {
    const [mockData, setMockData] = useState([]);

    return <div>
        Home
        <Button type="primary" onClick={ajax}>Button</Button>
    </div>
}