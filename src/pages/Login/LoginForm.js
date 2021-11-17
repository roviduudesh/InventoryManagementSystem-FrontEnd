import React, {useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import {useForm, Form} from ".././../components/useForm";
import Controls from "../../components/controls/Controls";
import Popup from "../../components/Popup";
import {Dialog, DialogContent, DialogTitle, Typography} from "@mui/material";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Notification from '../../components/Notification';
import Supplier from '../supplier/Supplier';
import { base, loginApi } from '../../enum/urls';

const initialFValues = {
    userName:'',
    password:'',
}

export default function LoginForm(props) {

    const {setLoading, setUser} = props;
    const [openPopup, setOpenPopup] = useState(true);
    const [notify, setNotify] = useState({isOpen:false, message:'', type:''});
    // const [userId, setUserId] = useState({});
    const history = useHistory();
    
    const validate = (fieldValues = values) => {
        let temp = {...errors}
        if('userName' in fieldValues) {
            temp.userName = fieldValues.userName ? "" : "This field is required"
        }
        if('password' in fieldValues) {
            temp.password = fieldValues.password ? "" : "This field is required"
        }
        setErrors({
            ...temp
        })
        if(fieldValues == values) {
            return Object.values(temp).every(x => x == "")
        }
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate)

    const handleSubmit = e =>{
        e.preventDefault();
        console.log('values', values)
        if(validate()) {
            axios.post(base.baseUrl + loginApi.baseUrl, values)
            .then(response => {
                let type;
                console.log("response.data: ", response.data.data);
                
                if(response.data.status == 200){
                    type = 'success';
                    setUser(response.data.data);
                    window.localStorage.setItem('user', JSON.stringify(response.data.data));
                    setLoading(false);
                    setOpenPopup(false)
                } else{
                    type = 'error';
                }
                              
                notification(true, response.data.message, type);
            }).catch(error => {
                console.log('Something went wrong!', error);
            });
        }
    }

    const notification = (open, message, type) =>{
        setNotify({
            isOpen: open,
            message: message,
            type: type
        })
    }
    
    useEffect(() =>{
        
        if(!openPopup){
            // {console.log('useEffect Login')}
            // console.log('user', userId)
            history.push("/supplier");
        }
    }, [notify])

    return (
        <>
            <Dialog open={openPopup}>
                <DialogTitle>
                    <div style={{textAlign:'center'}}>
                        <Typography variant="h4" component="div">
                            {'Login'}
                        </Typography>
                        
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                <Form onSubmit={handleSubmit}>
                    <div style={{textAlign:'center'}}>
                    <Grid container direction="row">
                        <Grid item xs={12} >
                            <Controls.Input
                                name="userName"
                                label="Enter Username"
                                value={values.userName}
                                onChange={handleInputChange}
                                error={errors.userName}
                            />

                            <Controls.Input
                                name="password"
                                label="Enter Password"
                                value={values.password}
                                onChange={handleInputChange}
                                error={errors.password}
                                type={'password'}
                            />
                            <Controls.Button
                                style={{marginLeft: 10}}
                                type="submit"
                                text="Submit"
                            />

                            <Controls.Button
                                style={{marginLeft: 10}}
                                color="inherit"
                                text="Reset"
                                onClick={resetForm}
                            />
                        </Grid>
                        {/* <Grid item xs={6}>
                            <Controls.Button
                                style={{marginLeft: 10}}
                                type="submit"
                                text="Submit"
                            />

                            <Controls.Button
                                style={{marginLeft: 10}}
                                color="inherit"
                                text="Reset"
                                onClick={resetForm}
                            />
                        </Grid> */}
                    </Grid>
                    </div>
                </Form>
                </DialogContent>
            </Dialog>

            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </>
            
        
    );
}

