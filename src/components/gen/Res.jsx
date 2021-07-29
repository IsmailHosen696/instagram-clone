import React from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts';
import '../css/Search.css';

export default function Res({ users }) {
    const { currentUser } = useAuth()
    return (
        <div className='red_holder'>
            {users.length > 0 ?
                users.map(user => (
                    <div className="user_map" key={user.id}>
                        <img className='search_res_user_img' src={user.userprofile} alt="search_res_user" />
                        <Link to={user.userid === currentUser.uid ? '/profile' : `/p/${user.username}`}>{user.username}</Link>
                    </div>
                )) :
                <p>No recent searches.</p>
            }
        </div>
    )
}
