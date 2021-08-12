import React, { useEffect, useState } from 'react'
import Nav from '../gen/Nav'
import '../css/Search.css';
import { firestore } from '../../firebase';
import Res from '../gen/Res';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Search() {
    const [ searchText, setSearchText ] = useState('');
    const [ explorePosts, setExplorePosts ] = useState([]);
    const [ user, setUser ] = useState([]);
    const [ filetereduser, setFiletereduser ] = useState([]);
    const [ open, setOpen ] = useState(false);
    useEffect(() => {
        document.title = 'Search';
        return firestore.collection('posts').onSnapshot(snapshot => {
            setExplorePosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        })
    }, [])
    useEffect(() => {
        firestore.collection('users').limit(10).onSnapshot(snapshot => {
            setUser(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        })
        setFiletereduser(user.filter(user => user.username.includes(searchText)));
    }, [ searchText, user ])
    return (
        <div>
            <Nav />
            <div className="search_small_box">
                <div className="search_contents" >
                    <div className="inpt" >
                        <input type="text" value={searchText || ''} className='search_input_small' onClick={e => setOpen(true)} onChange={e => setSearchText(e.target.value)} placeholder='search' />
                        {
                            open && <div className="openSearch">
                                <FontAwesomeIcon className='times' onClick={e => setOpen(false)} icon={faTimes} />
                                <Res users={filetereduser} />
                            </div>
                        }
                    </div>
                    <div className="explore_posts" onClick={e => setOpen(false)}>
                        {
                            explorePosts.map(postImg =>
                                postImg.type === 'video' ?
                                    <video src={postImg.postPhoto} key={postImg.id} className='explore_posts_img' controls ></video>
                                    :
                                    <img src={postImg.postPhoto} key={postImg.id} className='explore_posts_img' alt="explore_posts" />
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
