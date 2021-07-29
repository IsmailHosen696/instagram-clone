import React, { useEffect, useState } from 'react';
import { firestore } from '../../firebase';
import Show from './Show';
import Skeleton from 'react-loading-skeleton';
import SuggestUser from './SuggestUser';
import { useAuth } from '../../contexts/AuthContexts';
import '../css/ShowPost.css';
import '../css/Suggetion.css'
import { Link } from 'react-router-dom';


export default function DisplayPost() {
    const [ posts, setPosts ] = useState([]);
    const [ users, setUsers ] = useState([]);
    const [ suggestedUsers, setSuggestedUsers ] = useState([]);
    const { currentUser } = useAuth();


    // for update following and follwers

    useEffect(() => {
        const unsubscribe = firestore.collection('users').orderBy('timestamp', 'desc').limit(5).onSnapshot(snapshot => {
            setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return unsubscribe;
    }, [ currentUser.uid ])


    useEffect(() => {
        const unsubscribe = firestore.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        })
        setSuggestedUsers(users.filter(user => user.userid !== currentUser.uid && !user.followers.includes(currentUser.uid)));
        return unsubscribe;
    }, [ users, currentUser.uid ])

    return (
        <div className='display_post_wrapper'>
            <div className="posts_display">
                <div className="posts_display_left">
                    {posts.length > 0 ? posts.map(post =>
                        <Show post={post} key={post.id} />
                    )
                        :
                        <div>
                            <p>There is no posts to see. Add your own first post or follow people</p>
                            <Skeleton count={1} width={600} height={50} />
                            <Skeleton count={1} width={600} height={500} />
                            <Skeleton count={1} width={600} height={50} />
                        </div>
                    }
                </div>
                <div className="posts_display_right">
                    <div className="my_p">
                        <div className="logedIn_id">
                            <img src={currentUser.photoURL} alt='my_p_profile' className='my_p_profile' />
                            <Link className='my_p_link' to='/profile'>{currentUser.displayName}</Link>
                            <Link to='/signin' className='switch'>switch</Link>
                        </div>
                    </div>
                    <div className='suggested_user'>
                        <p>Suggestions for you</p>
                        <div className="div">
                            {suggestedUsers.length > 0
                                ?
                                suggestedUsers.map(user => <SuggestUser key={user.id} user={user} />)
                                :
                                <>
                                    <p>no user to see</p>
                                    <div className="skel">
                                        <Skeleton count={1} width={50} height={50} circle={true} />
                                        <Skeleton style={{ marginLeft: '1em' }} count={1} width={100} height={30} />
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
