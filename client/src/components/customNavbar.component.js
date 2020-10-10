import Navbar from 'react-bootstrap/Navbar';
import React,{Component} from 'react';
import Nav from 'react-bootstrap/Nav';
import Axios from 'axios';
import Modal from 'react-bootstrap/Modal'
import Dropdown from 'react-bootstrap/Dropdown';
// #d8ff00
export default class CustomNavbar extends Component{
  constructor(props){
    super(props);
    this.state={
      imageSrc:'',
      openResetPasswordModal:false,
      newPassword:'',
      currentPassword:'',
      confirmPassword:'',
      passwordsMatch:true,
    }
  }
    componentDidMount(){
        Axios.get('/api/auth/getProfilePic/'+localStorage.getItem('userID')).then((res)=>{
          this.setState({imageSrc:res.data.imageSrc})
        })
    }
    render(){
        return (
          <>
          <Modal show={this.state.openResetPasswordModal} onHide={()=>{
            this.setState({openResetPasswordModal:false});
          }}>
            <Modal.Header closeButton>
              <Modal.Title>Reset Password</Modal.Title>
            </Modal.Header>
            <form onSubmit={(e)=>{
              e.preventDefault();
              if(this.state.newPassword===this.state.confirmPassword)
              Axios.post('/api/auth/resetPassword',{
                currentPassword:this.state.currentPassword,
                newPassword:this.state.newPassword
              },{
                headers:{
                  authorization:'Bearer '+localStorage.getItem('token')
                }
              }).then((res)=>{
                if(res.status==='200')
                this.setState({openResetPasswordModal:false});
              })
              else
              this.setState({passwordsMatch:false})
            }}>
            <Modal.Body>
              <input type='password' className='form-control site-input' placeholder='Current Password' onChange={(e)=>{
                this.setState({currentPassword:e.target.value})
              }} required/>
              <input type='password' className='form-control site-input mt-2' placeholder='New Password' onChange={(e)=>{
                this.setState({newPassword:e.target.value})
              }} required/>
              <input type='password' className='form-control site-input mt-2' placeholder='Confirm Password' onChange={(e)=>{
                this.setState({confirmPassword:e.target.value})
              }} required/>
              <span className='text-danger' style={{display:this.state.passwordsMatch?'none':'block'}}>Passwords don't Match</span>
            </Modal.Body>
            <Modal.Footer>
              <button className='main-btn btn-block py-2'> Reset Password</button>
            </Modal.Footer>
            </form>
          </Modal>
            <Navbar style={{backgroundColor:'#d8ff00'}} bg='dark' variant="dark">
            <Navbar.Brand href="/"><img src='/logo.png' alt='Logo' width="50vh"
        height="50vh"
        className="d-inline-block align-top ml-4" /></Navbar.Brand>
            <Nav className="ml-auto mr-5">
              
              
              <Dropdown className='mr-2'>
                
                <Dropdown.Toggle split variant='dark'><img src={this.state.imageSrc===''?'./avatar.png':this.state.imageSrc} className='rounded border border-white mr-2' alt=' ' height='55vh' width='55vh'/></Dropdown.Toggle>
              
              <Dropdown.Menu>
              <Dropdown.Item onClick={()=>{
                window.location='/editProfile'
              }}>Edit Profile</Dropdown.Item>
              <Dropdown.Item onClick={()=>{
                this.setState({openResetPasswordModal:true})
              }}>Reset Password</Dropdown.Item>
                <Dropdown.Item onClick={()=>{
                localStorage.removeItem('token');
                localStorage.removeItem('userID');
                window.location='/';
              }}>Logout</Dropdown.Item>
              
              </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar></>
        );
    }
}