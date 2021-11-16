import React from 'react';
import {Snackbar} from "@mui/material";
import {Alert} from "@mui/material";

export default function Notification(props) {

    const{notify, setNotify} = props;

    const handleClose = (event, reason) =>{
        setNotify({
            ...notify,
            isOpen: false
        })
    }
    
    return (
        <Snackbar
            style={{marginTop:'3%'}}
            open={notify.isOpen}
            autoHideDuration={4000}
            anchorOrigin={{vertical:'top', horizontal:'right'}}
            onClose={handleClose}
        >
            <Alert
                severity={notify.type ? notify.type : null}
                onClose={handleClose}
            >
                <b>{notify.message}</b>
            </Alert>
        </Snackbar>
    );
}
