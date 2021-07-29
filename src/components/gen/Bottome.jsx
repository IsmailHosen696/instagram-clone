import { AddAPhoto } from '@material-ui/icons';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React from 'react'
import '../css/Nav.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';


export default function Bottome({ url }) {
    return (
        <>
            {
                url === '/' ?
                    <Link className='icons dark' to='/'>
                        <HomeRoundedIcon />
                    </Link>
                    :
                    <Link className='icons' to='/'>
                        <HomeRoundedIcon />
                    </Link>
            }
            {
                url === '/search' ?
                    <Link className='icons dark' to='/search'>
                        <FontAwesomeIcon icon={faSearch} />
                    </Link>
                    :
                    <Link className='icons' to='/search'>
                        <FontAwesomeIcon icon={faSearch} />
                    </Link>
            }
            {
                url === '/post' ?
                    <Link className='icons dark' to='/post'>
                        <AddAPhoto />
                    </Link>
                    :
                    <Link className='icons ' to='/post'>
                        <AddAPhoto />
                    </Link>
            }
            {
                url === '/profile' ?
                    <Link className='icons dark' to='/profile'>
                        <AccountCircleIcon />
                    </Link>
                    :
                    <Link className='icons ' to='/profile'>
                        <AccountCircleIcon />
                    </Link>
            }
        </>
    )
}
