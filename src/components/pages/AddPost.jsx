import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContexts';
import { firestore, storage, timestamp } from '../../firebase';
import '../css/AddPost.css';
import Nav from '../gen/Nav'

export default function AddPost() {
    const { currentUser } = useAuth();
    const [ postImage, setPostImage ] = useState(null);
    const [ progre, setProgre ] = useState(0);
    const [ error, setError ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ user, setUser ] = useState([]);
    const postInputRef = useRef();
    const [ pre, setPre ] = useState();
    const imgFunc = e => {
        setPostImage(e.target.files[ 0 ])
    };
    useEffect(() => {
        document.title = 'Add Post'
        if (postImage === null) {
            setPre(null)
            return
        }
        const objectUrl = URL.createObjectURL(postImage)
        setPre(objectUrl);
        return () => URL.revokeObjectURL(objectUrl)

    }, [ postImage ])
    const [ loading, setLoading ] = useState(false);

    const uploadTask = e => {
        setLoading(true);
        setError('')
        return new Promise((resolve, reject) => {
            const uploadTask = storage.ref(`/posts/${postImage.name}`).put(postImage);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgre(progress);
                },
                (error) => {
                    setError(error.message);
                },
                () => { storage.ref('/posts').child(postImage.name).getDownloadURL().then(url => resolve(url)) }
            )

        })
    }
    useEffect(() => {
        const unsubscribe = firestore.collection('users').where('userid', '==', currentUser.uid).onSnapshot(snapshot => {
            setUser(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        })
        return unsubscribe;
    }, [ currentUser.uid ])

    const handleUpload = e => {
        e.preventDefault();
        console.log('asd');
        setError('');
        setMessage('');
        if (postInputRef.current.value === '') {
            return setError('please fill all the fields')
        }
        if (postImage === null) {
            return setError('select a photo from your local device');
        }
        uploadTask().then(url => {
            setLoading(true)
            firestore.collection('posts').add({
                fullname: user[ 0 ].fullname,
                username: user[ 0 ].username,
                userid: user[ 0 ].userid,
                userPhoto: user[ 0 ].userprofile,
                postPhoto: url,
                type: postImage.type.split('/')[ 0 ],
                postTitle: postInputRef.current.value,
                likes: [],
                timestamp: timestamp
            })
                .then(() => {
                    setMessage('post uploaded');
                    postInputRef.current.value = '';
                    setProgre(0);
                    setPostImage(null);
                    setLoading(false);
                })
                .catch(error => error.message);
        });
    }
    return (
        <div>
            <Nav />
            <div className='post_div_wrapper'>
                <div className="post_new_div">
                    <h1 className="post_new_heading">Post What On Your Mind</h1>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    <form className='post_new_form' onSubmit={handleUpload}>
                        <input ref={postInputRef} placeholder='post tiitle' className='post_new_input' type='text' autoComplete='off' />
                        <label htmlFor='file_post'>Choose Image for Post
                            <div className="post_image_choose">choose</div>
                            <input id='file_post' onChange={imgFunc} type="file" style={{ position: 'absolute', left: '-999999px', opacity: '0' }} />
                        </label>
                        {loading && <progress defaultValue={1} value={progre} max={100}>{progre} %</progress>}
                        <button type='submit' className=' post_btns'>Post</button>
                    </form>
                </div>
            </div>
            <div className="img_preview_div">
                {postImage && <img alt='img_preview' className='img_preview' src={pre} />}
            </div>
        </div>
    )
}
