import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContexts';
import { firestore } from '../../firebase';
import Nav from '../gen/Nav';
import ProfileData from './ProfileData';
import '../css/Profile.css';
import Skeleton from 'react-loading-skeleton';


export default function Profile() {
    const { currentUser } = useAuth();
    const [ profileData, setProfileData ] = useState([]);
    const [ posts, setPosts ] = useState([]);

    useEffect(() => {
        document.title = 'Profile'
        const subscribe = firestore.collection('users').where('userid', '==', currentUser.uid).onSnapshot(snapshot => {
            setProfileData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        })
        return subscribe;
    }, [ currentUser.uid ]);


    useEffect(() => {
        const subscription = firestore.collection('posts').where('userid', '==', currentUser.uid).onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        })
        return subscription
    }, [ currentUser.uid ])

    return (
        <div className='bg'>
            <Nav />
            <div className="profile_dis">
                <div className="profile_datas">
                    {profileData.length > 0 ?
                        profileData.map((profile, index) => (
                            <ProfileData posts={posts} profile={profile} key={index} />
                        )) :
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex' }}>
                                <Skeleton count={1} width={80} height={80} circle={true} />
                                <div style={{ display: 'flex', marginLeft: '5em', marginTop: '1em' }}>
                                    <Skeleton style={{ marginLeft: '1em' }} count={1} width={100} height={20} />
                                    <Skeleton style={{ marginLeft: '1em' }} count={1} width={100} height={20} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', marginLeft: '10em', marginTop: '1em' }}>
                                <Skeleton style={{ marginLeft: '1em' }} count={1} width={100} height={20} />
                                <Skeleton style={{ marginLeft: '1em' }} count={1} width={100} height={20} />
                            </div>
                        </div>
                    }
                </div>
                <div className="profile_posts">
                    {
                        posts.length > 0
                            ?
                            posts.map(post => (
                                post.type === 'video' ?
                                    <video key={post.id} src={post.postPhoto} className='profile_map_img' controls   ></video>
                                    :
                                    <img key={post.id} src={post.postPhoto} alt="post_display_photo" className='profile_map_img' />
                            ))
                            :
                            <div className="flex" style={{ display: 'grid', gridTemplateColumns: 'auto auto auto', position: 'relative', top: '12em', maxWidth: '1000px', margin: '0 auto' }}>
                                <Skeleton style={{ margin: '1em' }} count={1} width={200} height={200} />
                                <Skeleton style={{ margin: '1em' }} count={1} width={200} height={200} />
                                <Skeleton style={{ margin: '1em' }} count={1} width={200} height={200} />
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}
