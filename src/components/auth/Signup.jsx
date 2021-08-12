import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts';
import { firestore, storage, timestamp } from '../../firebase';
import '../css/Signup.css';
import Spinner from '../gen/Spinner';

export default function Signup() {
    useEffect(() => {
        document.title = 'Instagram - Sign Up'
    }, []);
    const passwordRef = useRef();
    const cPasswordRef = useRef();
    const [ email, setEmail ] = useState('')
    const [ fullname, setFullname ] = useState('');
    const [ username, setUsername ] = useState('');
    const [ profilePhoto, setProfilePhoto ] = useState(null);
    const [ error, setError ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const { signup } = useAuth();
    const history = useHistory();


    useEffect(() => {
        document.title = 'Instagram - Signup'
    }, [])

    const hadnelProfilePhoto = e => {
        setProfilePhoto(e.target.files[ 0 ]);
    }

    function uploadProfile() {
        const uploadTask = storage.ref(`/profiles/${profilePhoto.name}`).put(profilePhoto);
        setLoading(true);
        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                () => { },
                (error) => {
                    reject(error.message);
                },
                () => {
                    storage.ref('/profiles').child(profilePhoto.name).getDownloadURL().then(url => resolve(url)
                    )
                }
            )
        })
    }

    const handleSignup = async e => {
        e.preventDefault();
        setError('');
        setLoading(false);
        if (username === '' || fullname === '' || email === '' || passwordRef.current.value === '' || cPasswordRef.current.value === '') {
            return setError('all the input fields are required');
        }
        if (username.includes(' ')) {
            return setError('in username field spaces are not valid')
        }
        if (username.length < 4 || fullname.length < 4) {
            return setError('username and full name must be greater than 4 chareture')
        }
        if (passwordRef.current.value !== cPasswordRef.current.value) {
            return setError('password and confirm password are not matching');
        }
        if (passwordRef.current.value < 6 || cPasswordRef.current.value < 6) {
            return setError('password length must be greater than 6 chareture');
        }
        if (profilePhoto === null) {
            return setError('profile photo is requird after sign in cant change the profile')
        }
        if(firestore.collection('users').where('username','==',username).onSnapshot(snapshot=>  {
            snapshot.docs.map(doc=> (doc.data()))
        })){
            return setError('username already taken. use a different one !')
        }
        try {
            setError('');
            signup(email, passwordRef.current.value).then(async (user) => {
                setLoading(true);
                uploadProfile().then(async (url) => {
                    await user.user.updateProfile({ displayName: fullname, photoURL: url });
                    setLoading(true);
                    firestore.collection('users').add({
                        username: username,
                        fullname: fullname,
                        useremail: email,
                        userid: user.user.uid,
                        userprofile: url,
                        userBio: '',
                        following: [],
                        followers: [],
                        timestamp
                    })
                    history.push('/')
                }).catch(error => {
                    setLoading(false);
                    setError(error.message)
                });
            }).catch(e => setError(e.message));
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
        setLoading(false);
    }
    return (
        <>
            <div className='signup_container'>
                <div className="signup_box">
                    <h1 className='signup_header'>Sign up</h1>
                    {error && <p className='signup_error'>{error}</p>}
                    <div className="signup_form_div">
                        <form className="sigup_form" onSubmit={handleSignup}>
                            <div className="signup_div">
                                <label htmlFor="username">Username</label>
                                <input autoComplete='off' type="text" id='username' className='signup_input' value={username || ''} onChange={e => setUsername(e.target.value)} />
                            </div>
                            <div className="signup_div">
                                <label htmlFor="fullname">Full Name</label>
                                <input autoComplete='off' type="text" id='fullname' className='signup_input' value={fullname || ''} onChange={e => setFullname(e.target.value)} />
                            </div>
                            <div className="signup_div">
                                <label htmlFor="email">Email</label>
                                <input autoComplete='off' type="email" id='email' className='signup_input' value={email || ''} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="signup_div">
                                <label htmlFor="password">Password</label>
                                <input autoComplete='off' type="password" id='password' className='signup_input' ref={passwordRef} />
                            </div>
                            <div className="signup_div">
                                <label htmlFor="cpassword'">Confirm Password</label>
                                <input autoComplete='off' type="password" id='cpassword' className='signup_input' ref={cPasswordRef} />
                            </div>
                            <div className="signup_dv">
                                <label className='s'>Choose Profile
                                    <div className="fileS">Choose</div>
                                    <input type="file" style={{ position: 'absolute', left: '-9999999px', opacity: '0' }} onChange={hadnelProfilePhoto} />
                                </label>
                            </div>
                            <button className="signup_btn" type='submit'>Signup</button>
                        </form>
                        <div className="all_links">
                            <p className='have_acc'>Already Have An Account? <Link className='signin_to_link' to='/signin'>Signin</Link></p>
                        </div>
                    </div>
                </div>
            </div>
            {loading && <Spinner />}
        </>
    )
}
