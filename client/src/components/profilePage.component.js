import CustomNavbar from './customNavbar.component';
import React,{useEffect,useState} from 'react';
import Axios from 'axios';
export default function ProfilePage(){
    const [user,setUser]=useState(null);
    document.title='ShoutItOut | Profile';
    useEffect(()=>{
        Axios.get('/api/auth/getUserDetails',{
            headers:{
                authorization:'Bearer '+localStorage.getItem('token')
            }
        }).then((res)=>{
            setUser(res.data)
        })
    },[])
    return (
        <>
        <CustomNavbar/>
        
        <img src={user?'data:'+user.avatar.contentType+';base64,'+user.avatar.data:'./avatar.png'} alt='Profile Pic' width='100vw'/>
        </>
    );
} 