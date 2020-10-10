import React,{useState,useEffect} from 'react';
import CustomNavbar from './customNavbar.component';
import axios from 'axios';
import InputGroup from 'react-bootstrap/InputGroup';
export default function ProfilePage(){
    const [user,setUser]=useState(null);
    const [posts,setPosts]=useState(null);
    const [commentContent,setComment]=useState({});
    function getPosts(){
        axios.get('/api/post/profilePosts',{
            headers:{
                authorization:'Bearer '+localStorage.getItem('token')
            }
        }).then((res)=>{
            setPosts(res.data)
        })
    }
    useEffect(
        ()=>{
            document.title='ShoutItOut | Profile';
            axios.get('/api/auth/getUserDetails',{
                headers:{
                    authorization:'Bearer '+localStorage.getItem('token')
                }
            }).then((res)=>{
                setUser(res.data);
                getPosts();
            });
            
        },[]
    )
    return (
        <>
        <CustomNavbar/>
        <div className='container-fluid'>
            <div className='row mt-3'>
                {user?<div className='col-lg-8 mx-auto'>
                        <div className='d-flex flex-row justify-content-between align-items-center mb-3 px-3'>
                            <div className='d-flex flex-row'><img alt='Profile Pic' src={user.avatar?'data:'+user.avatar.contentType+';base64,'+user.avatar.data:'avatar.png'} className='rounded' width='100px'/>
                            <div className='d-flex flex-column px-4'>
                            <h3 className='mt-3 mb-1'>{user.fullname}</h3>
                            <h6>{user.email}</h6>
                            </div></div>
                            <div className='d-flex flex-column text-center'><h3>{user.followers.length}</h3><h4>Followers</h4></div>
                            <div className='d-flex flex-column text-center'><h3>{user.following.length}</h3><h4>Following</h4></div>
                        </div>
                        {
                            !posts?null:posts.map(post=>
                            {
                                let timestamp=new Date(post.createdAt);
                                return <div key={post._id} className='post-container rounded-lg shadow-lg bg-dark d-flex flex-column text-light mb-2 mx-3' >
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
                </div>:null}
            </div>
        </div>
        </>
    );
}