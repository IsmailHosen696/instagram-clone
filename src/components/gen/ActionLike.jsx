import React, { useContext } from 'react'
import { useAuth } from '../../contexts/AuthContexts';
import FirebaseContext from '../../contexts/FirebaseContext';
import { firestore } from '../../firebase';
import '../css/ShowPost.css';


export default function ActionLike({ post }) {
    const { FieldValue } = useContext(FirebaseContext);
    const { currentUser } = useAuth();
    const addLike = e => {
        firestore.collection('posts').doc(post.id).update({ likes: post.likes.includes(currentUser.uid) ? FieldValue.arrayRemove(currentUser.uid) : FieldValue.arrayUnion(currentUser.uid) })
    }
    return (
        <svg onClick={addLike} xmlns="http://www.w3.org/2000/svg" className="h-1 w-1 small_icon" fill={post.likes.includes(currentUser.uid) ? '#ED4956' : "none"} viewBox="0 0 24 24" stroke={post.likes.includes(currentUser.uid) ? '#ED4956' : "currentColor"}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    )
}
