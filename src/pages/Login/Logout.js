import React, {useEffect, useState} from 'react';
import Login from './Login';

export default function Logout(props) {

    const {setLoading, setUser} = props;
    
    useEffect(() =>{
        setUser(null);
        window.localStorage.setItem('user', JSON.stringify(null));
    }, [])

    return (
        
            <Login
                setLoading = {setLoading}
                setUser = {setUser}
            />
        
    );
}