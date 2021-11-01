import React, {useEffect} from 'react';
import {Grid} from "@mui/material";
import {useForm, Form} from "../../components/useForm";
import Controls from "../../components/controls/Controls";
import moment from 'moment';

const initialFValues = {
    id: 0,
    stockDate: new Date(),
    quantity:0,
    supplierId:'',
    supplierName:'',
    itemId:'',
    itemName:'',
    // itemId:''
}

export default function StockForm(props) {

    const {addOrEdit, recordForEdit, supplierOptions, itemOptions, disabled} = props
    const validate = (fieldValues = values) => {
        let temp = {...errors}
        // if('stockDate' in fieldValues) {
        //     temp.stockDate = fieldValues.stockDate ? "" : "This field is required"
        // }
        // if('contact' in fieldValues) {
        //     temp.contact = fieldValues.contact.length >= 10 ? "" : "This field is required"
        // }
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
            <Grid container direction="row">
                <Grid item xs={6}>
                    <Controls.DatePicker
                        name="stockDate"
                        label="Select Stock Date"
                        value={values.stockDate}
                        onChange={handleInputChange}
                        error={errors.stockDate}
                    />

                    <Controls.Input
                        name="quantity"
                        label="Enter Stock Quantity"
                        value={values.quantity}
                        onChange={handleInputChange}
                        error={errors.quantity}
                        disabled={disabled}
                        type='number'
                    />

                    <Controls.Select
                        name="supplierId"
                        label="Select Supplier"
                        options={supplierOptions}
                        value={values.supplierId}
                        onChange={handleInputChange}
                        error={errors.supplierId}
                        disabled={disabled}
                    />

                    <Controls.Select
                        name="itemId"
                        label="Select Item"
                        options={itemOptions}
                        value={values.itemId}
                        onChange={handleInputChange}
                        error={errors.itemId}
                        disabled={disabled}
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

