import React, {useEffect} from 'react';
import {Grid} from "@mui/material";
import {useForm, Form} from "../../components/useForm";
import Controls from "../../components/controls/Controls";

const initialFValues = {
    id: 0,
    name: '',
    price:'',
    quantity: 0,
    warranty:'',
}

export default function ItemForm(props) {

    const {addOrEdit, recordForEdit} = props

    const validate = (fieldValues = values) => {
        let temp = {...errors}
        if('supName' in fieldValues) {
            temp.supName = fieldValues.supName ? "" : "This field is required"
        }
        // if('contact' in fieldValues) {
        //     temp.contact = fieldValues.contact.length >= 10 ? "" : "This field is required"
        // }
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
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid 
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{width:'400px'}}
                >
                    <Controls.Input
                        name="name"
                        label="Item Name"
                        value={values.name}
                        onChange={handleInputChange}
                        error={errors.name}
                    />

                    <Controls.Input
                        name="price"
                        label="Item Price"
                        value={values.price}
                        onChange={handleInputChange}
                        error={errors.price}
                    />

                    <Controls.Input
                        name="quantity"
                        label="Item Quantity"
                        value={values.quantity}
                        onChange={handleInputChange} 
                        error={errors.quantity}
                    />

                    <Controls.Input
                        name="warranty"
                        label="Item warranty (months)"
                        value={values.warranty}
                        onChange={handleInputChange} 
                        error={errors.warranty}
                    />

                    <Controls.Button
                        style={{marginLeft: 10}}
                        type="submit"
                        text="Submit"
                    />  

                    <Controls.Button
                        style={{marginLeft: 10, marginTop: 10}}
                        color="inherit"
                        text="Reset"
                        onClick={resetForm}
                    />
                </Grid>
            
            </Grid>
        </Form>
    );
}

