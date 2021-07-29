import React, { useEffect } from 'react';
import Nav from './Nav';
import DisplayPost from './DisplayPost';

export default function Home() {

    useEffect(() => {
        document.title = 'Instagram';
    }, [])
    return (
        <div>
            <Nav />
            <DisplayPost />
        </div>
    )
}
