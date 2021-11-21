import React, {useEffect, useState} from 'react';
import axios from "axios";
import Notification from '../../components/Notification'
import ConfirmDialog from '../../components/ConfirmDialog'
import Loader from "../../components/Loader";
import { base, loginApi } from '../../enum/urls';
import LoginForm from './LoginForm';
import { useHistory } from "react-router-dom";

export default function Login(props) {

    const history = useHistory();
    const {setLoading, setUser} = props;
    const [user] = useState(JSON.parse(window.localStorage.getItem('user')));
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [notify, setNotify] = useState({isOpen:false, message:'', type:''});
    const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title:'', subTitle:''})
 
    const addOrEdit = (user, resetForm) => {
        setLoading(true);
        axios.post(base.baseUrl + loginApi.baseUrl, user)
        .then(response => {
            let type;
            console.log("response.data: ", response.data.data);
            
            if(response.data.status == 200){
                type = 'success';
                setUser(response.data.data);
                window.localStorage.setItem('user', JSON.stringify(response.data.data));
                setLoading(false);
                history.push("/supplier");
            } else{
                type = 'error';
                setLoading(false);
            }
                            
            notification(true, response.data.message, type);
        }).catch(error => {
            console.log('Something went wrong!', error);
        });
        
        resetForm();
        setRecordForEdit(null);
    }

    const notification = (open, message, type) =>{
        setNotify({
            isOpen: open,
            message: message,
            type: type
        })
    }
    
    return (
        <>
            <Loader/>

                <LoginForm
                    recordForEdit={recordForEdit}
                    addOrEdit={addOrEdit}
                />

            <Notification
                notify={notify}
                setNotify={setNotify}
            />
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </> 
    );
}
