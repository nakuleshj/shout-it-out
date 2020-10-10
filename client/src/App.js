import React from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import HomePage from './components/homePage.component';
import AuthPage from './components/authPage.component';
import EditProfilePage from './components/editProfilePage.component';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function App() {
  return (
    
    <Router>
      <Route path='/' exact component={()=>{
        if(!localStorage.getItem('token'))
        return <AuthPage/>
        else
        return <HomePage/>
      }} />
      <Route path='/editProfile' exact component={()=>{
        if(!localStorage.getItem('token'))
        return <Redirect to='/'/>
        else
        return <EditProfilePage/>
      }}/>
      {/* <Route path='/profile' exact component={()=>{
        if(!localStorage.getItem('token'))
        return <Redirect to='/'/>
        else
        return <ProfilePage/>
      }}/> */}
    </Router>
  );
}