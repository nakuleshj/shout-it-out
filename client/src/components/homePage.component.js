import React,{useState,useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import CustomNavbar from './customNavbar.component';
import axios from 'axios';
import InputGroup from 'react-bootstrap/InputGroup';
import '../styling/HomePage.css';

export default function HomePage () {
    const [newPostContent,setNewPostContent]=useState('');
    const [commentModalOpen,setCommentModalOpen]=useState(false);
    const [posts,setPosts]=useState([]);
    useEffect(() => {
        axios.get('api/post',{
            headers:{
                authorization:'Bearer '+localStorage.getItem('token')
            }
        }).then((res)=>{
            console.log(res.data[0]._id);
            res.data.reverse().map((sentPost)=>
            setPosts(prevState=>{return [...prevState,sentPost]})
        )}).catch((e)=>console.log(e.toString()));
    },[]);
    
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
                        <Form className='my-3' onSubmit={(e)=>{e.preventDefault();
                        axios.post('api/post/add',{
                            content:newPostContent
                        },{
                            headers:{
                                authorization:'Bearer '+localStorage.getItem('token')
                            }
                        }).then((res)=>{window.location.reload()})
                        }}>
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
                        
                        {
                            
                            posts.map(post=>
                            {
                            return <div key={post._id} className='post-container rounded-lg shadow-lg bg-dark d-flex flex-column text-light mb-2' >
                            <div className='d-flex flex-row px-3 pt-2 border-dark'>

                                <img src='/avatar.png' alt='Logo' className='rounded user-profile-pic mr-2' width="50" height="50" />
                                <div className='d-flex flex-column pl-1'>
                            <b>{post.postedBy.fullname}</b>
                            <p>{post.postedBy.email}</p>
                                </div>
                            </div>
                            <div className='px-3'>
                                {post.content}
                            </div>
                            <form>
                            <div className='d-flex flex-row px-2 py-2 bg-secondary rounded-bottom'>
                            <button type='button' className='like-btn' onClick={()=>{
                                if(!post.likers.find((liker)=>{return liker===localStorage.getItem('userID')}))
                                   axios.post('api/post/like/'+post._id,{},{
                                       headers:{
                                           'authorization':'Bearer '+localStorage.getItem('token')
                                       }
                                   }).then((res)=>{
                                       
                                    
                                        post.likers.push(localStorage.getItem('userID'));
                                    setPosts(prevState=>{return [...prevState]});
                                
                            
                            });
                            else
                            axios.post('api/post/unlike/'+post._id,{},{
                                headers:{
                                    'authorization':'Bearer '+localStorage.getItem('token')
                                }
                            }).then((res)=>{
                                let index=post.likers.indexOf(localStorage.getItem('userID'));
                                post.likers.splice(index,1);
                                setPosts(prevState=>{
                                    return [...prevState];
                                });
                            })

                                }}><i className={post.likers.find((liker)=>{return liker===localStorage.getItem('userID')})?"fa fa-heart":"fa fa-heart-o"}></i></button>
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
