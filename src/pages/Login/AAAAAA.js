import React, {useEffect, useState} from 'react';
import LoginForm from './LoginForm';

export default function AAAAAA(props) {

    const {setLoading, setUser} = props;
    const [notify, setNotify] = useState({isOpen:false, message:'', type:''});
    
    useEffect(() =>{
        setUser(null);
        window.localStorage.setItem('user', JSON.stringify(null));
    }, [notify])

    return (
        
            <LoginForm
                setLoading = {setLoading}
                setUser = {setUser}
            />
        
    );
}