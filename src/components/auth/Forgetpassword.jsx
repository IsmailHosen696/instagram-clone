import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts';
import '../css/Forget.css';
import Spinner from '../gen/Spinner';

export default function Signin() {
    const emailRef = useRef();
    const [ error, setError ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ message, setMessage ] = useState('');
    const { forgetpassword } = useAuth();
    useEffect(() => {
        document.title = 'Forgetpassword';
    }, [])
    const handleforget = async e => {
        e.preventDefault();
        setMessage('');
        setError('');
        if (emailRef.current.value === '' || emailRef.current.value === undefined) {
            return setError('all inputs are valid !');
        }
        try {
            setError('');
            setLoading(true);
            await forgetpassword(emailRef.current.value);
            setMessage('an email has been sent to your mailBox for further instruction !');
        } catch (error) {
            setMessage('');
            setError(error.message);
        }
        setLoading(false);
    }
    return (
        <>
            <div className='forget_container'>
                <div className="forget_box">
                    <h1 className='forget_header'>Sign In</h1>
                    <div className='forget_input_boxes'>
                        {error && <p className="forget_error">{error}</p>}
                        {message && <p className="forget_success">{message}</p>}
                        <form className='forget_form' onSubmit={handleforget}>
                            <div className='forget_input_div'>
                                <label htmlFor="forget_input">Email</label>
                                <input type="email" autoComplete='false' ref={emailRef} className='forget_input' id='forget_input' />
                            </div>
                            <button className="forget_btn" type='submit'>Send</button>
                        </form>
                        <div className='auth_ls'>
                            <Link to='/signin' className='forget_to_signup'> Login</Link>
                        </div>
                    </div>
                </div>
            </div>
            {loading && <Spinner />}
        </>
    )
}
