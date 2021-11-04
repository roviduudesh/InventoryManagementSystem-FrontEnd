import React, {useEffect} from 'react';
import {Grid} from "@mui/material";
import {useForm, Form} from "../../components/useForm";
import Controls from "../../components/controls/Controls";

const initialFValues = {
    id: 0,
    firstName: '',
    lastName: '',
    address1:'',
    address2:'',
    address3:'',
    email:'',
    contact:''
}

export default function CustomerForm(props) {

    const {addOrEdit, recordForEdit} = props

    const validate = (fieldValues = values) => {
        let temp = {...errors}
        if('firstName' in fieldValues) {
            temp.firstName = fieldValues.firstName ? "" : "This field is required"
        }
        if('contact' in fieldValues) {
            temp.contact = fieldValues.contact.length == 10 || fieldValues.contact.length == 0 ? "" : "Invalid Contact Number"
        }
        if('email' in fieldValues) {
            temp.email = (/$^|.+@.+..+/).test(values.email) ? "" : "Email is not valid"
        }
        // if('departmentId' in fieldValues) {
        //     temp.departmentId = values.departmentId.length != 0 ? "" : "Thid field is required"
        // }
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
        <Form onSubmit={handleSubmit} style={{ overflow: "hidden" }}>
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
                        error={errors.lastName}
                    />

                    <Controls.Input
                        name="email"
                        label="Email"
                        value={values.email}
                        onChange={handleInputChange}
                        error={errors.email}
                    />

                    <Controls.Input
                        name="contact"
                        label="Contact (Number 1, Number 2, ....)"
                        value={values.contact}
                        onChange={handleInputChange}
                        error={errors.contact}
                        type='number'
                    />
                </Grid>
                <Grid item xs={6}>
                    
                    <Controls.Input
                        name="address1"
                        label="Address Line 1"
                        value={values.address1}
                        onChange={handleInputChange}
                    />

                    <Controls.Input
                        name="address2"
                        label="Address Line 2"
                        value={values.address2}
                        onChange={handleInputChange}
                    />

                    <Controls.Input
                        name="address3"
                        label="Address Line 3"
                        value={values.address3}
                        onChange={handleInputChange}
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

