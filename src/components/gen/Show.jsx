import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts';
import { firestore, timestamp } from '../../firebase';
import '../css/ShowPost.css';
import ActionLike from './ActionLike';

export default function Show({ post }) {
    const [ comment, setComment ] = useState('');
    const { currentUser } = useAuth();
    const commentRef = useRef();
    const [ comments, setComments ] = useState([]);

    const hadnleAdComment = e => {
        e.preventDefault();
        firestore.collection('posts').doc(post.id).collection('comments').add({
            comment,
            timestamp,
            username: currentUser.displayName
        })
        setComment('')
    }

    useEffect(() => {
        const unsubscribe = firestore.collection('posts').doc(post.id).collection('comments').orderBy('timestamp', 'desc').limit(3).onSnapshot(snapshot => {
            setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        })
        return unsubscribe;
    }, [ post.id, post ])

    return (
        <div className="post_display_ev">
            <div className="post_display_nav">
                <img className='post_display_nav_profile' alt='post_display_nav_profile' src={post.userPhoto} />
                <Link to={post.userid === currentUser.uid ? `profile` : `/p/${post.username}`} className='post_display_nav_name'>{post.username}</Link>
            </div>
            <div className="post_display_body">
                {post.type === 'video' ?

                    <video src={post.postPhoto} className='post_display_photo' controls ></video>
                    :
                    <img src={post.postPhoto} alt="post_display_photo" className='post_display_photo' />

                }
                <div className="post_display_body_name_title">
                    <h1 className="post_display_body_name">{post.username}</h1>
                    <h3 className="post_display_body_title">{post.postTitle}</h3>
                </div>
                <div className="post_display_body_like_comment_icon_box">
                    <ActionLike post={post} />
                    <svg onClick={e => commentRef.current.focus()} xmlns="http://www.w3.org/2000/svg" className="h-1 w-1 small_icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>

                <div className="post_display_total_like">
                    <h1 className='like_count'>{post.likes.length} likes</h1>
                </div>
            </div>
            <div className="post_display_comment_section">
                {
                    comments.map(comment => (
                        <div className="comment_div" key={comment.id}>
                            <h3 className="h3 username_com">{comment.username}</h3>
                            <h5 className="h5">{comment.comment}</h5>
                        </div>
                    ))
                }
                <div className="comment_input_div">
                    <form className='form' onSubmit={hadnleAdComment}>
                        <input placeholder=':-) add a comment' ref={commentRef} autoComplete='off' type="text" value={comment || ''} onChange={e => setComment(e.target.value)} className='comment_input' />
                        <button disabled={!comment} className='comment_btn' type='submit'>post</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
