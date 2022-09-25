import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";

export default function Redirect(props) {
    const navigate = useNavigate();
    useEffect(()=>{
        navigate(props.to)   
    },[])
}
