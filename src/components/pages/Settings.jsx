import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContexts'
import { firestore, storage } from '../../firebase';
import '../css/Settings.css'
import Spinner from '../gen/Spinner';
export default function Settings() {
    const { updatePassword, updateEmail, currentUser, signout, uploadProfilePhoto } = useAuth();
    const emailRef = useRef()
    const passwordRef = useRef()
    const cPasswordRef = useRef()
    const [ message, setMessage ] = useState('');
    const [ error, setError ] = useState()
    const history = useHistory()
    const [ profilePhoto, setProfilePhoto ] = useState(null);
    const [ posts, setPosts ] = useState([]);
    const [ user, setUser ] = useState([]);
    const hadnelProfilePhoto = e => {
        setProfilePhoto(e.target.files[ 0 ]);
    }
    const [ loading, setLoading ] = useState(false)

    useEffect(() => {
        return firestore.collection('posts').where('userid', '==', currentUser.uid).onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        })
    }, [ currentUser.uid ])
    useEffect(() => {
        return firestore.collection('users').where('userid', '==', currentUser.uid).onSnapshot(snapshot => {
            setUser(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        })
    }, [ currentUser.uid ])
    console.log(user[ 0 ]);

    function uploadProfile() {
        const uploadTask = storage.ref(`/profiles/${profilePhoto.name}`).put(profilePhoto);
        setLoading(true);
        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                () => { },
                (error) => {
                    setError(error.message);
                },
                () => {
                    storage.ref('/profiles').child(profilePhoto.name).getDownloadURL().then(url => resolve(url)
                    )
                }
            )
        })
    }

    useEffect(() => {
        document.title = 'Account - Settings '
    }, []);

    async function signOut() {
        await signout();
        history.push('/signin')
    }
    const handleSettings = e => {
        e.preventDefault();
        const promises = [];
        if (profilePhoto !== null) {
            promises.push(uploadProfile()
                .then(url => {
                    console.log(url);
                    posts.length > 0 && posts.map(post => firestore.collection('posts').doc(post.id).update({ userPhoto: url }))
                    user.length > 0 && firestore.collection('users').doc(user[ 0 ].id).update({ userprofile: url });
                    uploadProfilePhoto(url)
                    setProfilePhoto(null);
                }))
        }
        if (emailRef.current.value !== currentUser.email) {
            setLoading(true)
            promises.push(updateEmail(emailRef.current.value))
        }
        if (passwordRef.current.value) {
            if (passwordRef.current.value !== cPasswordRef.current.value) {
                return setError('password and confirm must be same')
            }
            if (passwordRef.current.value.length < 6 || cPasswordRef.current.value.length < 6) {
                return setError('password length must be greater than 6 charectre')
            } else {
                setLoading(true)
                promises.push(updatePassword(passwordRef.current.value))
            }
        }
        Promise.all(promises).then(e => { history.push('/profile') }).catch(e => setError(e.message)).finally(() => { setLoading(false); setMessage('settings updated') })
    }
    return (
        <div className='settings_container'>
            <div className="settings_box">
                <h1 className="settings_heading">Set Your Email and Account</h1>
                <form className="settings_form" onSubmit={handleSettings}>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
                    <div className="settings_input_div">
                        <label htmlFor="email">Email</label>
                        <input type="email" ref={emailRef} id='email' defaultValue={currentUser.email} placeholder='your email' autoComplete='off' />
                    </div>
                    <div className="settings_input_div">
                        <label htmlFor="password">Password</label>
                        <input type="password" ref={passwordRef} id='password' placeholder='leave blank to keep same password' autoComplete='off' />
                    </div>
                    <div className="settings_input_div">
                        <label htmlFor="cpassword">Confirm password</label>
                        <input type="password" id='cpassword' ref={cPasswordRef} placeholder='leave blank to keep same password' autoComplete='off' />
                    </div>
                    <div className="signup_dv">
                        <label className='s'>Choosr Profile
                            <div className="fileS">Choose</div>
                            <input type="file" style={{ position: 'absolute', left: '-9999999px', opacity: '0' }} onChange={hadnelProfilePhoto} />
                        </label>
                    </div>
                    <button type='submit' className='settings_btn_up'>update account</button>
                </form>
                <button onClick={signOut} className='logout_btn'>logout</button>
                <Link to='/profile' className='back_pr'>Back</Link>
            </div>
            {loading && <Spinner />}
        </div>
    )
}
