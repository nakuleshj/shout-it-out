import React from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import HomePage from './components/homePage.component';
import AuthPage from './components/authPage.component';
import ProfilePage from './components/profilePage.component';
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
      <Route path='/profile' exact component={()=>{
        if(!localStorage.getItem('token'))
        return <Redirect to='/'/>
        else
        return <ProfilePage/>
      }}/>
    </Router>
  );
}