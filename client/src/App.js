import React from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import CustomNavbar from './components/customNavbar.component';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    
    <Router>
      <Route path='/' exact component={()=>{
        return <CustomNavbar/>
      }} />
    </Router>
  );
}
export default App;