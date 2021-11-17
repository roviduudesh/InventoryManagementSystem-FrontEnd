import React, {useEffect} from 'react';
import {Grid} from "@mui/material";
import {useForm, Form} from ".././../components/useForm";
import Controls from "../../components/controls/Controls";

const initialFValues = {
    id: 0,
    firstName: '',
    lastName:'',
    userName:'',
    password:'',
    level:'user',
    contact:''
}

const levelValues = [
    {id: 'admin', title: 'Admin'},
    {id: 'user', title: 'User'},
]

export default function SupplierForm(props) {

    const {addOrEdit, recordForEdit, user} = props

    const validate = (fieldValues = values) => {
        let temp = {...errors}
        if('firstName' in fieldValues) {
            temp.firstName = fieldValues.firstName ? "" : "This field is required"
        }
        if('userName' in fieldValues) {
            temp.userName = fieldValues.userName.length >= 4 ? "" : "Invalid Username"
        }
        if('password' in fieldValues) {
            temp.password = fieldValues.password.length >= 4 ? "" : "Invalid Password"
        }
        if('contact' in fieldValues) {
            temp.contact = fieldValues.contact.length == 10 ? "" : "Invalid Contact Number"
        }
        if('level' in fieldValues) {
            temp.level = fieldValues.level ? "" : "This field is required"
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

    useEffect(() =>{
        if(recordForEdit != null){
            setValues({
                ...recordForEdit
            })
        }
    }, [recordForEdit])

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container direction="row">
                <Grid item xs={6}>
                    <Controls.Input
                        name="firstName"
                        label="First Name"
                        value={values.firstName}
                        onChange={handleInputChange}
                        error={errors.firstName}
                    />

                    <Controls.Input
                        name="lastName"
                        label="Last Name"
                        value={values.lastName}
                        onChange={handleInputChange}
                    />

                    <Controls.Input
                        name="userName"
                        label="UserName (Min: 4 Characters)"
                        value={values.userName}
                        onChange={handleInputChange}
                        disabled={recordForEdit ? true : false}
                        error={errors.userName}
                    />

                    <Controls.Input
                        name="password"
                        label="Password (Min: 4 Characters)"
                        value={values.password}
                        onChange={handleInputChange}
                        error={errors.password}
                    />
                </Grid>

                <Grid item xs={6}>
                    <Controls.Input
                        name="contact"
                        label="Contact Number"
                        value={values.contact}
                        onChange={handleInputChange}
                        error={errors.contact}
                        type='number'
                    />

                    <Controls.RadioGroup
                        name="level"
                        label="User Level"
                        value={values.level}
                        onChange={handleInputChange}
                        items={levelValues}
                        error={errors.level}
                        disabled={user.level == 'user' ? true : false}
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
            </Grid>
        </Form>
    );
}

