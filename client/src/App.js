import React from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import HomePage from './components/homePage.component';
import AuthPage from './components/authPage.component';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    
    <Router>
      <Route path='/' exact component={()=>{
        if(!localStorage.getItem('token'))
        return <AuthPage/>
        else
        return <HomePage/>
      }} />
    </Router>
  );
}
export default App;