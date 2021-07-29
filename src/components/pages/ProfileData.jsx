import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Link } from 'react-router-dom';
import '../css/Profile.css';

export default function ProfileData({ profile, posts }) {
    return (
        <div className='profile_d' key={profile.id}>
            <img className='profile_owner_img' alt='profile_owner_img' src={profile.userprofile} />
            <div className="links_p_small">
                <img className='profile_owner_img ac' alt='profile_owner_img' src={profile.userprofile} />
                <h3 className='profile_name_user aS'>{profile.username}</h3>
                <Link to='/settings' className='settings_profile'><FontAwesomeIcon icon={faCog} /> settings</Link>
            </div>
            <div className="row_0">
                <Link to='/updateprofile' className='edit_profile smal'>Edit Profile</Link>
                <div className="links_p">
                    <h3 className='profile_name_user'>{profile.username}</h3>
                    <Link to='/updateprofile' className='edit_profile'>Edit Profile</Link>
                    <Link to='/settings' className='settings_profile'><FontAwesomeIcon icon={faCog} /></Link>
                </div>
                <div className="row_2">
                    <h3 className='post_length'>{posts.length} posts</h3>
                    <h3 className='followers_length'>{profile.followers.length} Followers</h3>
                    <h3 className='following_length'>{profile.following.length} Following</h3>
                </div>
                <div className="row_3">
                    <h3 className="user_full_name">{profile.fullname}</h3>
                    <h3 className="user_bio">{profile.userBio}</h3>
                </div>
            </div>
        </div>
    )
}
