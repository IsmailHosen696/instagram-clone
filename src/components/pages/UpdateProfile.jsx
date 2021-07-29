import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/UpdateProfile.css';
import { useAuth } from '../../contexts/AuthContexts';
import { firestore } from '../../firebase';
import Spinner from '../gen/Spinner';
export default function UpdateProfile() {
    const usernameRef = useRef();
    const fullnameRef = useRef();
    const bioRef = useRef();
    const [ posts, setPosts ] = useState([]);
    const [ userDoc, setUserDoc ] = useState([]);
    const { currentUser, updadteName } = useAuth()
    const [ error, setError ] = useState();
    const [ message, setMessage ] = useState('');
    const [ loading, setLoading ] = useState(false);
    useEffect(() => {
        document.title = 'Edit - Profile';

        return firestore.collection('users').where('userid', '==', currentUser.uid).onSnapshot(snapshot => {
            setUserDoc(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        })
    }, [ currentUser.uid ])
    useEffect(() => {
        return firestore.collection('posts').where('userid', '==', currentUser.uid).onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        })
    }, [ currentUser.uid ])

    const handleSubmit = e => {
        setError('');
        setMessage('')
        e.preventDefault();
        const promises = []
        if (usernameRef.current.value.includes(' ')) {
            return setError('in username field spaces are not valid')
        }
        else {
            if (fullnameRef.current.value !== userDoc[ 0 ].fullname) {
                setLoading(true);
                promises.push(firestore.collection('users').doc(userDoc[ 0 ].id).update({ fullname: fullnameRef.current.value }));
                posts.length > 0 && posts.map(post => promises.push(firestore.collection('posts').doc(post.id).update({ fullname: usernameRef.current.value })))
                promises.push(updadteName(fullnameRef.current.value));
            }
            if (usernameRef.current.value !== userDoc[ 0 ].username) {
                setLoading(true);
                promises.push(firestore.collection('users').doc(userDoc[ 0 ].id).update({ username: usernameRef.current.value }))
                posts.length > 0 && posts.map(post => promises.push(firestore.collection('posts').doc(post.id).update({ username: usernameRef.current.value })))
            }
            if (bioRef.current.value !== userDoc[ 0 ].userBio) {
                setLoading(true);
                promises.push(firestore.collection('users').doc(userDoc[ 0 ].id).update({ userBio: bioRef.current.value }))

            }
            Promise.all(promises).then(e => setMessage('profile updated')).catch(err => console.log(err.message)).finally(e => setLoading(false))
        }
    }
    return (
        <div className='profile_container'>
            <div className="profileBox">
                <h1 className="update_heading">Update Profile</h1>
                {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <form className='update_form' onSubmit={handleSubmit}>
                    <div className="input_divs_update">
                        <label htmlFor="username">Username</label>
                        <input required defaultValue={userDoc[ 0 ]?.username} ref={usernameRef} type="text" autoComplete='off' id='username' placeholder='user name' />
                    </div>
                    <div className="input_divs_update">
                        <label htmlFor="fullname">Full Name</label>
                        <input required defaultValue={userDoc[ 0 ]?.fullname} ref={fullnameRef} type="text" id='fullname' autoComplete='off' placeholder='full name' />
                    </div>
                    <div className="input_divs_update">
                        <label htmlFor="bio">Bio</label>
                        <input required defaultValue={userDoc[ 0 ]?.userBio} ref={bioRef} type="text" id='bio' placeholder='your bio' autoComplete='off' />
                    </div>
                    <button type='submit' className='bio_update_btn'>Update</button>
                </form>
                <Link className='to_profile' to='/profile'>Back</Link>
            </div>
            {
                loading && <Spinner />
            }
        </div>
    )
}
