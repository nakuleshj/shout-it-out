import Navbar from 'react-bootstrap/Navbar';
import React,{Component} from 'react';
import Nav from 'react-bootstrap/Nav';
// #d8ff00
export default class CustomNavbar extends Component{
    componentDidMount(){

    }
    render(){
        return (
            <Navbar style={{backgroundColor:'#d8ff00'}} bg='dark' variant="dark">
            <Navbar.Brand href="#home"><img src='/logo.png' alt='Logo' width="40"
        height="40"
        className="d-inline-block align-top"/></Navbar.Brand>
        
            
            
            <Nav className="ml-auto">
              <Nav.Link onClick={()=>{
                localStorage.removeItem('token');
                localStorage.removeItem('userID');
                window.location='/';
              }}>Logout</Nav.Link>
            </Nav>
          </Navbar>
        );
    }
}