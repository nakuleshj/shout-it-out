import React, { useState } from 'react';
import '../styling/AuthPage.css';
import axios from 'axios';
export default function AuthPage(){
    const [loginEmail,setLoginEmail]=useState('');
    const [loginPassword,setLoginPassword]=useState('');
    const [registerEmail,setRegisterEmail]=useState('');
    const [registerPassword,setRegisterPassword]=useState('');
    const [registerName,setRegisterName]=useState('')
    return(
        <div className='container-fluid h-100 login-background'>
            <div className='row h-100'>
                <div className='col-md-6 my-2 mx-auto'>
                    <img src='logo.png' className="img-fluid mx-auto d-block" width='200' height='200' alt='Shout It Out'/>
                    <div className='row bg-white p-5 shadow-lg'>
                        <div className='col-lg-6 border-md-right pr-lg-5'>
                    <h1 className=''><strong>Login</strong></h1>
                    <form onSubmit={(e)=>{
                            e.preventDefault();
                            axios.post('api/auth/login',{email:loginEmail,password:loginPassword}).then((res)=>{
                                localStorage.setItem('token',res.data.token);
                                localStorage.setItem('userID',res.data.userID);
                               console.log(res.data);
                            }).catch((e)=>{console.log(e.toString())});
                        }}>
                        <input className='form-control my-2 login-input' placeholder='Email Address' onChange={(e)=>{
                            setLoginEmail(e.target.value);
                        }}/>
                        
                        <input className='form-control mb-2 login-input' type='password' placeholder='Password' onChange={(e)=>{
                            setLoginPassword(e.target.value);
                        }}/>
                        
                        <button className='btn btn-block auth-btn'><b>Login</b></button>
                        
                    </form>
                    </div>
                    <div className='col-lg-6 pl-lg-5 mt-lg-0 mt-sm-3'>
                    <h1 className=''><strong>Register</strong></h1>

                    <form onSubmit={(e)=>{e.preventDefault();axios.post('api/auth/register',{
                        fullname:registerName,
                        email:registerEmail,
                        password:registerPassword
                    }).then((res)=>{
                        localStorage.setItem('token',res.data.token);
                        localStorage.setItem('userID',res.data.userID);
                        window.location.reload();
                    })

                        }}>
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
                    </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}