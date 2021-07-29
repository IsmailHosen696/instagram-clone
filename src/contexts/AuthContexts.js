import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../firebase';


const AuthContexts = React.createContext();
export const useAuth = () => {
    return useContext(AuthContexts);
}

export default function AuthProvider({ children }) {
    const [ currentUser, setCurrentUser ] = useState();
    const [ loading, setLoading ] = useState(true);

    const signin = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password);
    }
    const signup = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password);
    }
    const forgetpassword = email => {
        return auth.sendPasswordResetEmail(email);
    }
    const signout = () => {
        return auth.signOut();
    }
    const updateEmail = (email) => {
        return currentUser.updateEmail(email)
    }
    const updatePassword = (password) => {
        return currentUser.updatePassword(password)
    }
    const updadteName = (name) => {
        return currentUser.updateProfile({ displayName: name })
    }
    const uploadProfilePhoto = (url) => {
        return currentUser.updateProfile({ photoURL: url });
    }
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        })
        return unsubscribe;
    }, []);
    const value = {
        signin,
        signup,
        forgetpassword,
        currentUser,
        signout,
        updadteName,
        updatePassword,
        updateEmail,
        uploadProfilePhoto
    }
    return (
        <AuthContexts.Provider value={value}>
            {!loading && children}
        </AuthContexts.Provider>
    )
}
