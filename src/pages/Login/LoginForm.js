import React, {useEffect, useState} from 'react';
import {useForm, Form} from ".././../components/useForm";
import Controls from "../../components/controls/Controls";
import Notification from '../../components/Notification';
import { Paper, Box, Container } from "@mui/material";

const initialFValues = {
    userName:'',
    password:'',
}

export default function LoginForm(props) {

    const {addOrEdit} = props;
    const [notify, setNotify] = useState({isOpen:false, message:'', type:''});
    
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

        if(validate()) {
            addOrEdit(values, resetForm);
        }
    }

    return (
        <>
        <Container maxWidth='sm'>
        <h1>Login</h1>
            <Form onSubmit={handleSubmit}>
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
            </Form>
        </Container>
        
        <Notification
            notify={notify}
            setNotify={setNotify}
        />
        </>
    );
}

