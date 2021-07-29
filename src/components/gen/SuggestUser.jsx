import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts';
import FirebaseContext from '../../contexts/FirebaseContext';
import { firestore } from '../../firebase';
import '../css/Suggetion.css'



export default function SuggestUser({ user }) {
    const { currentUser } = useAuth();
    const [ some, setSome ] = useState([]);
    const [ mId, setMId ] = useState();
    const { FieldValue } = useContext(FirebaseContext)

    useEffect(() => {
        const unsubscribe = firestore.collection('users').where('userid', '==', currentUser.uid).onSnapshot(snapshot => {
            setSome(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        })
        some.map(user => setMId(user.id))
        return unsubscribe;
    }, [ currentUser.uid, some ]);


    const updateFollow = e => {
        e.preventDefault();
        firestore.collection('users').doc(user.id).update({ followers: FieldValue.arrayUnion(currentUser.uid) });
        firestore.collection('users').doc(mId).update({ following: FieldValue.arrayUnion(user.userid) });
    }

    return (
        <div className="suggest_user">
            <img alt='suggestion_profile' className='suggetion_profile' src={user.userprofile} />
            <Link to={`/p/${user.username}`} className='user_p_link'>{user.username}</Link>
            <button className="follow_btn" onClick={updateFollow}>follow</button>
        </div>
    )
}
