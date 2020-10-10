import React,{useState} from 'react';
import axios from 'axios';
import InputGroup from 'react-bootstrap/InputGroup'
export default function postContainer(props){
  const getPosts=props.getPost;
  const [commentContent,setComment]=useState({});
        const post=props.post;
            let timestamp=new Date(post.createdAt);
            return (<div key={post._id} className='post-container rounded-lg shadow-lg bg-dark d-flex flex-column text-light mb-2' >
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
            
            getPosts();
        })

            }}><i className={post.likers.find((liker)=>{return liker===localStorage.getItem('userID')})?"fa fa-heart":"fa fa-heart-o"}></i></button>
           
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
    </div>)

}