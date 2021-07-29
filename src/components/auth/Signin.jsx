import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts';
import '../css/Signin.css';
import Spinner from '../gen/Spinner';

export default function Signin() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [ error, setError ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const history = useHistory();
    const { signin } = useAuth();
    useEffect(() => {
        document.title = 'Instagram - Sign In';
    }, [])
    const handleSignin = async e => {
        e.preventDefault();
        if (emailRef.current.value === '' || passwordRef.current.value === '' || emailRef.current.value === undefined || passwordRef.current.value === undefined) {
            return setError('all inputs are valid !');
        } else {

            try {
                setLoading(true);
                setError('');
                await signin(emailRef.current.value, passwordRef.current.value).then(user => {
                });
                history.push('/');
            } catch (error) {
                setError(error.message);
            }
            setLoading(false);
        }
    }
    return (
        <>
            <div className='signin_container'>
                <div className="signin_box">
                    <h1 className='signin_header'>Sign In</h1>
                    <div className='signin_input_boxes'>
                        {error && <p className="signin_error">{error}</p>}
                        <form className='signin_form' onSubmit={handleSignin}>
                            <div className='signin_input_div'>
                                <label htmlFor="signin_input">Email</label>
                                <input type="email" autoComplete="off" ref={emailRef} className='signin_input' id='signin_input' />
                            </div>
                            <div className='signin_input_div'>
                                <label htmlFor="signin_input_pass">Password</label>
                                <input type="password" ref={passwordRef} className='signin_input' id='signin_input_pass' />
                            </div>
                            <Link to='/forgetpassword' className='signin_to_forget'>Fotget Password</Link>
                            <button className="signin_btn" type='submit'>Signin</button>
                        </form>
                        <div className='auth_links'>
                            <p className='signup_to_text'>Don't Have An Account? <Link to='/signup' className='signin_to_signup'> Sign up</Link></p>
                        </div>
                    </div>
                </div>
            </div>
            {loading && <Spinner />}
        </>
    )
}
