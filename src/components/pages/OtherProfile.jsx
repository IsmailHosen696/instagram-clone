import React, { useContext, useEffect, useState } from 'react'
import { firestore } from '../../firebase';
import Nav from '../gen/Nav';
import Skeleton from 'react-loading-skeleton';
import '../css/OtherProfile.css'
import { useAuth } from '../../contexts/AuthContexts';
import FirebaseContext from '../../contexts/FirebaseContext';

export default function OtherProfile() {
    const [ username, setUsername ] = useState('');
    const [ userInfo, setUserInfo ] = useState([]);
    const [ posts, setPosts ] = useState([]);
    const { currentUser } = useAuth();
    const { FieldValue } = useContext(FirebaseContext)
    const [ id, setId ] = useState('');

    useEffect(() => {
        setUsername(window.location.pathname.split('/')[ 2 ])
        return firestore.collection('users').where('userid', '==', currentUser.uid).onSnapshot(snapshot => {
            setId(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        })
    }, [ currentUser.uid ])

    const handleFollow = e => {
        e.preventDefault()
        firestore.collection('users').doc(e.target.id).update({ followers: FieldValue.arrayUnion(currentUser.uid) });
        firestore.collection('users').doc(id[ 0 ].id).update({ following: FieldValue.arrayUnion(userInfo[ 0 ].userid) });

    }
    const handleUnfollow = e => {
        e.preventDefault()
        firestore.collection('users').doc(e.target.id).update({ followers: FieldValue.arrayRemove(currentUser.uid) });
        firestore.collection('users').doc(id[ 0 ].id).update({ following: FieldValue.arrayRemove(userInfo[ 0 ].userid) });
    }

    useEffect(() => {
        function userInfoFunc() {
            document.title = `${username} - insta`;
            return new Promise((resolve, reject) => {
                firestore.collection('users').where('username', '==', username).onSnapshot(snapshot => {
                    resolve(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
                    setUserInfo(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
                })
            })
        }
        return userInfoFunc().then(docs => {
            docs.map(doc => (
                firestore.collection('posts').where('userid', '==', doc.userid).onSnapshot(snapshot => {
                    setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                })
            ))
        })
    }, [ username ]);

    return (
        <div>
            <Nav />
            <div className="userInfo_container">
                <div className="userInfo_map">
                    {
                        userInfo.map(user => (
                            <div className="userInfo" key={user.id}>
                                <img src={user.userprofile} alt="user_profile" className='user_info_profile' />
                                <div className="column">
                                    <div className="row-1">
                                        <h3 className='userinfo_username'>{user.username}</h3>
                                        {
                                            userInfo[ 0 ].followers.includes(currentUser.uid) ?
                                                <button id={user.id} className='follow_unfollow' onClick={handleUnfollow}>unfollow</button> :
                                                <button id={user.id} className='follow_unfollow' onClick={handleFollow}>follow</button>
                                        }
                                    </div>
                                    <div className="row-2">
                                        <p className='user_info_posts'><span>{posts.length}</span> posts</p>
                                        <p className='user_info_followers'><span>{user.followers.length}</span> followers</p>
                                        <p className='user_info_following'><span>{user.following.length}</span> following</p>
                                    </div>
                                    <div className="row-3">
                                        <p className='user_info_fullname'>{user.fullname}</p>
                                        <p className='user_info_bio'>{user.bio}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="userPost_info">
                    {posts.length > 0 ? (

                        posts.map(post => (
                            <div className="postmap" key={post.id}>
                                {post.type === 'video' ?
                                    <video key={post.id} src={post.postPhoto} className='user_post_photo' controls ></video>
                                    :
                                    <img key={post.id} src={post.postPhoto} alt="post_display_photo" className='user_post_photo' />}
                            </div>
                        ))
                    ) :
                        <>
                            <Skeleton style={{ margin: '1em' }} count={1} width={200} height={150} />
                            <Skeleton style={{ margin: '1em' }} count={1} width={200} height={150} />
                        </>
                    }
                </div>
            </div>
        </div>
    )
}
