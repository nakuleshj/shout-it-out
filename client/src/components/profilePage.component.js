import CustomNavbar from './customNavbar.component';
import React,{useEffect,useState} from 'react';
import Axios from 'axios';

export default function ProfilePage(){
    const [user,setUser]=useState(null);
    const [updatedEmail,setUpdatedEmail]=useState('');
    const [updatedName,setUpdatedName]=useState('');
    document.title='ShoutItOut | Profile';
    useEffect(()=>{
        Axios.get('/api/auth/getUserDetails',{
            headers:{
                authorization:'Bearer '+localStorage.getItem('token')
            }
        }).then((res)=>{
            setUser(res.data)
            setUpdatedEmail(res.data.email)
            setUpdatedName(res.data.fullname)
        })
    },[])
    return (
        <>
        <CustomNavbar/>
        <div className='fluid-container'>
            <div className='row w-100'>
                <div className='col-lg-4 mx-auto '>
        <img src={user?'data:'+user.avatar.contentType+';base64,'+user.avatar.data:'./avatar.png'} alt='Profile Pic' width='150vw' className='mt-3 rounded d-block mx-auto'/>
        <label style={{cursor:"pointer"}} className='mx-auto d-block text-center'>
            <input type='file' className='d-none' />
            Change Profile Picture
        </label>
        <form onSubmit={(e)=>{
            e.preventDefault();
            Axios.post('/api/auth/updateUser',{
                newEmail:updatedEmail,
                newFullname:updatedName
            },{
                headers:{
                    authorization:'Bearer '+localStorage.getItem('token')
                }
            }).then((res)=>{
                window.location.reload();
            }).catch((e)=>{
                console.log(e);
            })
        }}>
            <input className='site-input form-control' placeholder='Full Name' defaultValue={user?user.fullname:''} onChange={(e)=>{
                setUpdatedName(e.target.value)
            }}/>
            <input type='email' className='site-input form-control mt-2' placeholder='Email Address' defaultValue={user?user.email:''} onChange={(e)=>{
                setUpdatedEmail(e.target.value)
            }}/>
            
            <button className='main-btn w-100 mt-3 py-3'>Save</button>
        </form>
        </div></div></div>
        </>
    );
} 