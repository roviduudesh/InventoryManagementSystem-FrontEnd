import React, {useEffect, useState} from 'react';
import Login from './Login';

export default function Logout(props) {

    const {setLoading, setUser} = props;
    const [notify, setNotify] = useState({isOpen:false, message:'', type:''});
    
    useEffect(() =>{
        setUser(null);
        window.localStorage.setItem('user', JSON.stringify(null));
    }, [notify])

    return (
        
            <Login
                setLoading = {setLoading}
                setUser = {setUser}
            />
        
    );
}