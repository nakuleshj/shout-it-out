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
                    <img src='logo.png' class="img-fluid mx-auto d-block" width='200' height='200' alt='Shout It Out'/>
                    <div className='row bg-white p-5 shadow-lg'>
                        <div className='col-md-6 border-right pr-5'>
                    <h1 className=''><strong>Login</strong></h1>
                    <form onSubmit={(e)=>{
                            e.preventDefault();
                            axios.post('api/auth/login',{email:loginEmail,password:loginPassword}).then((res)=>{
                                localStorage.setItem('token',res.data.token);
                                console.log(res);
                                window.location.reload();
                            })
                        }}>
                        <input className='form-control my-2 login-input' placeholder='Email Address' onChange={(e)=>{
                            setLoginEmail(e.target.value);
                        }}/>
                        
                        <input className='form-control mb-2 login-input' type='password' placeholder='Password' onChange={(e)=>{
                            setLoginPassword(e.target.value);
                        }}/>
                        
                        <button class='btn btn-block auth-btn'><b>Login</b></button>
                        
                    </form>
                    </div>
                    <div className='col-md-6 pl-5'>
                    <h1 className=''><strong>Register</strong></h1>

                    <form onSubmit={(e)=>{e.preventDefault();axios.post('api/auth/register',{
                        fullname:registerName,
                        email:registerEmail,
                        password:registerPassword
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