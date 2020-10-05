import React, { useState } from 'react';
import '../styling/AuthPage.css';
import axios from 'axios';
import Modal from 'react-bootstrap/esm/Modal';
export default function AuthPage(){
    const [loginEmail,setLoginEmail]=useState('');
    const [loginPassword,setLoginPassword]=useState('');
    const [openRegisterModal,setOpenRegisterModal]=useState(false);
    const [registerEmail,setRegisterEmail]=useState('');
    const [registerPassword,setRegisterPassword]=useState('');
    const [registerName,setRegisterName]=useState('')
    const [pickedImage,setPickedImage]=useState('');
    const [avatarFile,setAvatarFile]=useState(null);
    document.title='ShoutItOut | Login/Register';
    return(
        <div className='container-fluid h-100 login-background'>
            <Modal show={openRegisterModal} onHide={()=>{
                setOpenRegisterModal(false)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title><h1 className=''><strong>Register</strong></h1></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={(e)=>{e.preventDefault();
                    const formData=new FormData();
                    formData.append('avatar',avatarFile)
                    formData.append('fullname',registerName);
                    formData.append('email',registerEmail);
                    formData.append('password',registerPassword);
                    axios.post('api/auth/register',formData,{
                        headers:{
                            'content-type':'multipart/form-data'
                        }
                        
                    }).then((res)=>{
                        localStorage.setItem('token',res.data.token);
                        localStorage.setItem('userID',res.data.userID);
                        window.location.reload();
                    })

                        }}>
                            <img src={avatarFile?pickedImage:'/avatar.png'} alt='Logo' className='rounded d-block mx-auto' height="100" />
                            <label className='attachFile d-block mx-auto text-center pt-1' >
                        <input type='file' accept='.png,.jpg,.jpeg' onChange={(e)=>{
                            if (e.target.files && e.target.files[0])
                            {
                                setAvatarFile(e.target.files[0]);
                                
                                setPickedImage(URL.createObjectURL(e.target.files[0]));
                            }
                            
                        }}/><b>Add Profile Picture</b></label>
                        <input className='form-control my-2 login-input' placeholder='Full Name' onChange={(e)=>{
                            setRegisterName(e.target.value);
                        }}/>
                        <input className='form-control mb-2 login-input' placeholder='Email Address' onChange={(e)=>{
                            setRegisterEmail(e.target.value);
                        }}/>
                        <input className='form-control mb-2 login-input' placeholder='Password' type='password' onChange={(e)=>{
                            setRegisterPassword(e.target.value);
                        }}/>
                        
                        <button className='btn btn-block reg-button'><b>Register</b></button>
                    </form>
                </Modal.Body>
            </Modal>
            <div className='row h-100'>
                <div className='col-md-6 my-2 mx-auto'>
                    <img src='logo.png' className="img-fluid mx-auto d-block" width='200' height='200' alt='Shout It Out'/>
                   
                       <div className='bg-white p-5'>
                    <h1 className=''><strong>Login</strong></h1>
                    <form onSubmit={(e)=>{
                            e.preventDefault();
                            axios.post('api/auth/login',{email:loginEmail,password:loginPassword}).then((res)=>{
                                localStorage.setItem('token',res.data.token);
                                localStorage.setItem('userID',res.data.userID);
                               window.location.reload()
                            }).catch((e)=>{console.log(e.toString())});
                        }}>
                        <input className='form-control my-2 login-input' placeholder='Email Address' onChange={(e)=>{
                            setLoginEmail(e.target.value);
                        }} required/>
                        
                        <input className='form-control mb-2 login-input' type='password' placeholder='Password' onChange={(e)=>{
                            setLoginPassword(e.target.value);
                        }} required/>
                        
                        <button className='btn btn-block auth-btn'><b>Login</b></button>
                        <button type='button' className='btn btn-block reg-btn' onClick={()=>{
                            setOpenRegisterModal(true);
                        }}><b>Register</b></button>
                        
                    </form>
                  
                    
                    </div>
                        </div>
                
            </div>
        </div>
    );
}