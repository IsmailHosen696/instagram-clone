import React, { useState, useRef } from 'react';
import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContexts';
import { firestore, storage, timestamp } from '../../firebase';
import '../css/Post.css';

export default function Post() {
    const { currentUser } = useAuth();
    const [ postImage, setPostImage ] = useState(null);
    const [ progre, setProgre ] = useState(0);
    const [ error, setError ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ user, setUser ] = useState([]);
    const postInputRef = useRef();
    const imgFunc = e => setPostImage(e.target.files[ 0 ]);
    const [ loading, setLoading ] = useState(false);

    const uploadTask = e => {
        setLoading(true);
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
                timestamp
            })
                .then(() => {
                    setMessage('post uploaded');
                    postInputRef.current.value = '';
                    setProgre(0);
                    setLoading(false);
                })
                .catch(error => error.message);
        });
    }
    return (
        <div className='post_wrapper'>
            <div className="post_div">
                <h1 className="post_heading">Post On Your Mind</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {message && <p style={{ color: 'green' }}>{message}</p>}
                <form className='post_form' onSubmit={handleUpload}>
                    <input ref={postInputRef} placeholder='post tiitle' className='post_inpur' type='text' autoComplete='off' />
                    <label htmlFor='file_post'>Choose Image for Post
                        <div className="post_choose_div">Choose</div>
                        <input id='file_post' onChange={imgFunc} type="file" style={{ position: 'absolute', left: '-999999px', opacity: '0' }} />
                    </label>
                    {loading && <progress value={progre} className='progress_bar' max={100}>{progre} %</progress>}
                    <button type='submit' className='post_btn'>Post</button>
                </form>
            </div>
        </div>
    )
}
