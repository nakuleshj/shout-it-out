import Navbar from 'react-bootstrap/Navbar';
import React,{Component} from 'react';
import Nav from 'react-bootstrap/Nav';
import Axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
// #d8ff00
export default class CustomNavbar extends Component{
  constructor(props){
    super(props);
    this.state={
      imageSrc:''
    }
  }
    componentDidMount(){
        Axios.get('/api/auth/getProfilePic/'+localStorage.getItem('userID')).then((res)=>{
          this.setState({imageSrc:res.data.imageSrc})
        })
    }
    render(){
        return (
            <Navbar style={{backgroundColor:'#d8ff00'}} bg='dark' variant="dark">
            <Navbar.Brand href="/"><img src='/logo.png' alt='Logo' width="40"
        height="40"
        className="d-inline-block align-top" /></Navbar.Brand>
            <Nav className="ml-auto">
              
              
              <Dropdown>
                <Dropdown.Toggle variant='dark'>
              <img src={this.state.imageSrc} className='rounded border border-white mr-3' alt=' ' height='50vh'/></Dropdown.Toggle>
              <Dropdown.Menu>
              <Dropdown.Item onClick={()=>{
                window.location='/profile'
              }}>Profile</Dropdown.Item>
                <Dropdown.Item onClick={()=>{
                localStorage.removeItem('token');
                localStorage.removeItem('userID');
                window.location='/';
              }}>Logout</Dropdown.Item>
              
              </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar>
        );
    }
}