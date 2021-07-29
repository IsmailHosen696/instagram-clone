import { faCog, faSignOutAlt, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContexts';
import { Link, useHistory } from 'react-router-dom';
import SendIcon from '@material-ui/icons/Send';
import Bottome from './Bottome';
import Post from './Post';
import '../css/Nav.css';
import { HomeOutlined } from '@material-ui/icons';
import { firestore } from '../../firebase';
import Res from './Res';

export default function Nav() {
    const { currentUser, signout } = useAuth();
    const [ click, setClick ] = useState(false)
    const [ url, setUrl ] = useState('')
    const [ postOpen, setPostOpen ] = useState(false);
    const [ open, setOpen ] = useState(false)
    const [ user, setUser ] = useState([]);
    const [ searchText, setSearchText ] = useState('');
    const [ filteredUser, setFilteredUser ] = useState([]);
    const history = useHistory();
    useEffect(() => {
        setUrl(window.location.pathname)
        firestore.collection('users').onSnapshot(snapshot => {
            setUser(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        })
        setFilteredUser(user.filter(user => user.username.includes(searchText)));
    }, [ url, searchText ])
    function logout() {
        signout();
        history.push('/signin');
    }
    return (
        <>
            <div className='nav_container'>
                <div className="nav">
                    <Link to='/' className='link_nav'>
                        <img className='nav_img_logo' alt='instagram_logo' src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' />
                    </Link>
                    <div className='search_box'>
                        <input autoComplete='off' placeholder='search' onClick={e => setOpen(true)} type="text" className='search_input' value={searchText || ''} onChange={e => setSearchText(e.target.value)} />
                        {open &&
                            <div className="bg_whie">
                                <FontAwesomeIcon className='time' onClick={e => setOpen(false)} icon={faTimes} />
                                <Res users={filteredUser} />
                            </div>
                        }

                    </div>
                    <div className='profile_img_container'>
                        <div className="home">
                            {url === '/profile' ?
                                ''
                                :
                                <SendIcon className='send_icon' onClick={e => { setPostOpen(!postOpen); setClick(false) }} titleAccess='post' />
                            }
                            {
                                url === '/' ?
                                    <Link className='icon dar' to='/'>
                                        <HomeRoundedIcon titleAccess='home' />
                                    </Link>
                                    :
                                    <Link className='icon dar' to='/'>
                                        <HomeOutlined titleAccess='home ' />
                                    </Link>
                            }
                        </div>
                        {url === '/profile' ?
                            <img className='user_img_profile' src={currentUser.photoURL} alt='user_profile' />
                            :
                            <img onClick={e => { setClick(!click); setPostOpen(false) }} className='user_img_profile' src={currentUser.photoURL} alt='user_profile' />
                        }
                    </div>
                </div>
                {/* pop ups */}
                {
                    click &&
                    <div className="nav_pop_cont">
                        <div className="nav_pop_up">
                            <Link className='profile_link' to='/profile'><FontAwesomeIcon icon={faUser} style={{ marginRight: '0.5em' }} /> profile</Link>
                            <button onClick={logout} className='lgout_btn'><FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '0.5em' }} /> logout</button>
                            <Link to='/settings' className='settings_btn'><FontAwesomeIcon icon={faCog} style={{ marginRight: '0.5em' }} />settings</Link>
                        </div>
                    </div>
                }
                {
                    postOpen && <Post />
                }
            </div>

            <div className="bottom_container">
                <div className="bottom">
                    <Bottome url={url} />
                </div>
            </div>
        </>
    )
}
