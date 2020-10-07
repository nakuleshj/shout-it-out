import React,{useState,useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import CustomNavbar from './customNavbar.component';
import axios from 'axios';
import InputGroup from 'react-bootstrap/InputGroup';
import '../styling/HomePage.css';
import Modal from 'react-bootstrap/Modal';
export default function HomePage () {
    const [pickedImage,setPickedImage]=useState('');
    const [newPostContent,setNewPostContent]=useState('');
    const [newImagePostContent,setNewImagePostContent]=useState('');
    const [posts,setPosts]=useState([]);
    const [commentContent,setComment]=useState({});
    const [file,setFile]=useState(null);
    const [showPhotoUploadModal,setShowPhotoUploadModal]=useState(false);
    document.title='ShoutItOut | Feed';
    function getPosts(isRefresh=false){
      
        axios.get('api/post',{
            headers:{
                authorization:'Bearer '+localStorage.getItem('token')
            }
        }).then((res)=>{
            setPosts([]);
           
            res.data.reverse().map((sentPost)=>
            setPosts(prevState=>{return [...prevState,sentPost]})
        )}).catch((e)=>console.log(e.toString()));
    }
    useEffect(getPosts,[]);
    return (
        <>
        <Modal show={showPhotoUploadModal} onHide={()=>{
            setShowPhotoUploadModal(false);
        }}><form onSubmit={(e)=>{
            e.preventDefault();
            const formData=new FormData();
            const config={
                headers:{
                    authorization:'Bearer '+localStorage.getItem('token'),
                    'content-type': 'multipart/form-data'
                }
            };
            formData.append('content',newImagePostContent)
            formData.append('postImage',file);
            axios.post('/api/post/media',formData,config).then((res)=>{
                console.log(res.status);
                setShowPhotoUploadModal(false);
                getPosts();
            });
        }}>
            <Modal.Header closeButton>
                <Modal.Title>Post Image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img src={pickedImage} alt='Picked' className='rounded img-fluid mb-1'/>
                <textarea className='form-control tweet-area' rows='2' placeholder="What's on your mind?" style={{resize:'false'}} required onChange={(e)=>{
                    setNewImagePostContent(e.target.value)
                }}/>
            </Modal.Body>
            <Modal.Footer>
                <button className='btn-block main-btn'>Upload</button>
            </Modal.Footer>
            </form>
        </Modal>
            <CustomNavbar />
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-lg-7 mx-auto'>
                        <Form className='my-3' onSubmit={(e)=>{e.preventDefault();
                        axios.post('api/post/add',{
                            content:newPostContent
                        },{
                            headers:{
                                authorization:'Bearer '+localStorage.getItem('token')
                            }
                        }).then((res)=>getPosts())
                        }}>
                            <InputGroup>
                            <InputGroup.Prepend>
                                    <button type='button' className='main-btn  border-right-0 rounded-left'><label className="attachFile">
                        <input type='file' accept='.png,.jpg,.jpeg' onChange={(e)=>{
                           
                            if(e.target.files)
                           {
                            setFile(e.target.files[0]);   
                            setShowPhotoUploadModal(true);
                            setPickedImage(URL.createObjectURL(e.target.files[0]))
                        }
                        }}/>
                        <i className='fa fa-paperclip text-large'></i>
                        </label></button>
                                </InputGroup.Prepend>
                                <textarea required type="textarea" className='form-control tweet-area' rows="2" placeholder="What's on your mind?" style={{ resize: 'none' }} onChange={(e)=>{
                                    
                                    setNewPostContent(e.target.value);
                                    
                                }}/>
                                <InputGroup.Append>
                                    <button className='main-btn  border-left-0 rounded-right'>Shout It</button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form>
                        
                        {
                            posts.map(post=>
                            {
                                let timestamp=new Date(post.createdAt);
                                return <div key={post._id} className='post-container rounded-lg shadow-lg bg-dark d-flex flex-column text-light mb-2' >
                                <div className='d-flex flex-row px-3 pt-2 border-dark'>
                                    <img src={post.postedBy.avatar?"data:"+post.postedBy.avatar.contentType+";base64,"+post.postedBy.avatar.data:'/avatar.png'} alt='Logo' className='rounded user-profile-pic mr-2' width="50" height="50" />
                                    <div className='d-flex flex-column pl-1'>
                                        <b>{post.postedBy.fullname}</b>
                                        <p>{post.postedBy.email}</p>
                                    </div>
                                    {post.postedBy._id===localStorage.getItem('userID')?<i className='fa fa-trash ml-auto delete-post pt-2' onClick={()=>{
                                        axios.delete('api/post/'+post._id,{
                                            headers:{
                                                authorization:'Bearer '+localStorage.getItem('token')
                                            }
                                        }).then((res)=>{
                                            console.log(res.status);
                                            getPosts();
                                        })
                                    }}></i>:null}
                            </div>
                            <div className='px-3 pb-1'>
                                {post.content}
                                {
                                    post.imageRef?<img className='rounded mx-auto d-block' style={{maxWidth: '70vw'}} src={"data:"+post.imageRef.contentType+";base64,"+post.imageRef.data} alt='newPostLOL'/>:null
                                }
                            </div>
                            <div className='text-light px-3 small pb-2'>{timestamp.getDate()+'/'+timestamp.getMonth()+'/'+timestamp.getFullYear()}</div>
                            <form onSubmit={(e)=>{
                                e.preventDefault();
                                axios.post('api/post/comment/'+post._id,{
                                    commentContent: commentContent[post._id]
                                },{
                                    headers:{
                                        authorization:'Bearer '+localStorage.getItem('token')
                                    }
                                }).then((res)=>{
                                    getPosts();
                                });
                            }}>
                            <div className={post.comments.length>0?'d-flex flex-row px-2 py-2 bg-secondary':'d-flex flex-row px-2 py-2 bg-secondary rounded-bottom'}>
                            <button type='button' className='like-btn mr-2' onClick={()=>{
                                if(!post.likers.find((liker)=>{return liker===localStorage.getItem('userID')}))
                                   axios.post('api/post/like/'+post._id,{},{
                                       headers:{
                                           'authorization':'Bearer '+localStorage.getItem('token')
                                       }
                                   }).then((res)=>{
                                    getPosts();
                                    //     post.likers.push(localStorage.getItem('userID'));
                                    // setPosts(prevState=>{return [...prevState]});
                            });
                            else
                            axios.post('api/post/unlike/'+post._id,{},{
                                headers:{
                                    'authorization':'Bearer '+localStorage.getItem('token')
                                }
                            }).then((res)=>{
                                // let index=post.likers.indexOf(localStorage.getItem('userID'));
                                // post.likers.splice(index,1);
                                // setPosts(prevState=>{
                                //     return [...prevState];
                                // });
                                getPosts();
                            })

                                }}><i className={post.likers.find((liker)=>{return liker===localStorage.getItem('userID')})?"fa fa-heart":"fa fa-heart-o"}></i></button>
                                {/* <button type='button' className='like-btn align-text-bottom px-3' onClick={()=>{
                                    setCurrentComments(post.comments);
                                    setCommentModalOpen(true);
                                }}><i className={"fa fa-comments-o"}></i></button> */}
                            <InputGroup >
                                <input className='comment form-control' placeholder={'Reply to '+ post.postedBy.fullname} onChange={
                                    (e)=>{
                                        const typedValue=e.target.value;
                                        setComment((comments)=>{
                                            const newComments={...comments};
                                            newComments[post._id]=typedValue;
                                            return newComments;
                                            });
                                    }
                                }/>
                                <InputGroup.Append>
                                <button className='comment-button rounded-right px-2'>Reply</button>
                                </InputGroup.Append>
                                </InputGroup>
                            </div>
                            </form>
                            <div>
                            {
                                post.comments.length>0?
                                <ul className = "list-unstyled pt-3 px-3">
                    {post.comments.map((comment)=>{
                        return <li key={comment._id}><p className='text-white' style={{wordBreak:'break-word'}}><b style={{color:'#d8ff00'}}>{comment.commentedBy.fullname}</b> {comment.commentContent}</p></li>
                    })}
                    </ul>:null}
                            </div>
                        </div>
                    })}
                    </div>
                </div>
            </div>
        </>
    );
}
