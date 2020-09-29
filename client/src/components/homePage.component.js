import React,{useState,useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import CustomNavbar from './customNavbar.component';
import axios from 'axios';
import InputGroup from 'react-bootstrap/InputGroup';
import '../styling/HomePage.css';

export default function HomePage () {
    const [newPostContent,setNewPostContent]=useState('');
    const [isLiked,setLike]=useState(false);
    const [commentModalOpen,setCommentModalOpen]=useState(false);
    const [posts,setPosts]=useState([]);
    useEffect(() => {
        axios.get('api/post').then((res)=>setPosts(res.data)).catch((e)=>console.log(e.toString()));
    });
    return (
        <>
        <Modal scrollable show={commentModalOpen} onHide={()=>{
            setCommentModalOpen(false);
        }}>
            <Modal.Header closeButton>
                <Modal.Title>Comments</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
            </Modal.Body>
        </Modal>
            <CustomNavbar />
            <div className='container-fluid'>
                
                <div className='row'>
                    <div className='col-sm-7 mx-auto'>
                        <Form className='my-3' onSubmit={(e)=>{e.preventDefault();}}>
                            <InputGroup >
                                <textarea type="textarea" className='form-control tweet-area' rows="2" placeholder="What's on your mind?" style={{ resize: 'none' }} onChange={(e)=>{
                                    setNewPostContent(e.target.value);
                                    console.log(e.target.value);
                                }}/>
                                <InputGroup.Append>
                                    <button className='main-btn  border-left-0 rounded-right'>Shout It</button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form>
                        {newPostContent}
                        {
                            posts.forEach(post=>
                            {
                            
                            return <div className='post-container rounded-lg shadow-lg bg-dark d-flex flex-column text-light'>
                            <div className='d-flex flex-row px-3 pt-2 border-dark'>

                                <img src='/avatar.png' alt='Logo' className='rounded user-profile-pic mr-2' width="50" height="50" />
                                <div className='d-flex flex-column pl-1'>
                                    <b>Nakulesh J</b>
                                    <p>nakuleshj1998@gmail.com</p>
                                </div>
                            </div>
                            <div className='px-3'>
                                {/* {post.content} */}
                            </div>
                            <div className='d-flex flex-row pl-2 py-1'>
                                
                            </div>
                            <form>
                            <div className='d-flex flex-row px-2 py-2 bg-secondary'>
                            <button type='button' className='like-btn' onClick={()=>{
                                    setLike(!isLiked);
                                }}><i className={isLiked?"fa fa-heart":"fa fa-heart-o"}></i></button>
                                <button type='button' className='like-btn align-text-bottom px-3' onClick={()=>{
                                    setCommentModalOpen(true);
                                }}><i className={"fa fa-comments-o"}></i></button>
                            <InputGroup >
                                <input className='comment form-control' placeholder={'Reply to Nakulesh J'}/>
                                <InputGroup.Append>
                                <button className='comment-button rounded-right px-2'>Reply</button>
                                </InputGroup.Append>
                                </InputGroup>
                               
                            </div>
                            </form>
                        </div>})}
                    </div>
                </div>
            </div>
        </>
    );
}
