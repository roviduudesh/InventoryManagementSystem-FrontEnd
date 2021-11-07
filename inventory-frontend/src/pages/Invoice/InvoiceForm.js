import React, {useState} from 'react';
import {Grid} from "@mui/material";
import {useForm, Form} from ".././../components/useForm";
import Controls from "../../components/controls/Controls";
import {Paper, TableBody, TableCell, TableRow} from "@mui/material";
import {makeStyles} from "@mui/styles";
import useTable from "../../components/useTable"

const initialFValues = {
    id: 0,
    customerId: '',
    customerName: '',
    itemId:'',
    itemName:'',
    quantity:'',
    amount:'',
    availableQty:'',
}

const useStyles = makeStyles(theme =>({
    pageContent: {
        margin: 20,
        padding: 20
    },
    searchInput:{
        width:'75%'
    },
    newButton:{
        position: 'absolute',
        left: 100,
        spacing:24
    }
}));

const headCells = [
    {id: 'itemName', label:'Item Name'},
    {id: 'quantity', label:'Quantity'},
    {id: 'amount', label:'Amount'},
]

export default function InvoiceForm(props) {

    // const classes = useStyles();
    const {addOrEdit, addToTable, recordList, customerOptions, itemOptions, itemQty} = props
    const [disableCustomer, setDisableCustomer] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [filterFn] = useState({fn: items => {return items;}})
    // console.log('itemQty', itemQty)

    const validate = (fieldValues = values) => {
        let temp = {...errors}
        
        if(recordList.length == 0){
            if('customerId' in fieldValues) {
                temp.customerId = fieldValues.customerId ? "" : "This field is required"
            }
        }
        if('itemId' in fieldValues) {
            temp.itemId = fieldValues.itemId ? "" : "This field is required"
        }
        if('quantity' in fieldValues) {
            temp.quantity = fieldValues.quantity ? "" : "Invalid Quantity"
        }
        if('availableQty' in fieldValues) {
            temp.quantity = values.quantity <= values.availableQty ? "" : "Invalid Quantityy"
        }
        if('amount' in fieldValues) {
            temp.amount = fieldValues.amount ? "" : "Invalid Amount"
        }
        setErrors({
            ...temp
        })
        
        if(fieldValues == values) {
            return Object.values(temp).every(x => x == "")
        }
    }

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(recordList, headCells, filterFn);

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate)

    const handleSubmit = e =>{
        console.log('recordList', recordList)
        addOrEdit(recordList, resetForm);
    }

    const setQty = e => {
        console.log('AAAA')
        console.log('values', values)

        if(values.itemId){
            let qty = itemQty.filter( function (i) {
                return i.id == values.itemId;
            })[0].quantity;
            values.availableQty = qty;
            // setValues(values);
        }
    }

    const addValue = e =>{
        if(validate()){
            addToTable(values, resetForm);
            setDisableSubmit(false);
            setDisableCustomer(true);
        }
    }

    // useEffect(() =>{
    //     if(recordForEdit != null){
    //         setValues({
    //             ...recordForEdit
    //         })
    //     }
    // }, [recordForEdit])
    // console.log('values.itemId', values.itemId)
    return (
        <Paper>
        <Form onSubmit={handleSubmit}>
            <Grid container direction="row">
                <Grid item xs={8}>
                <Controls.Select
                        name="customerId"
                        label="Select Customer"
                        options={customerOptions}
                        value={recordList.length > 0 ? recordList[0].customerId : values.customerId}
                        onChange={handleInputChange}
                        error={errors.customerId}
                        disabled={disableCustomer}
                        error={errors.customerId}
                    />

                    <Controls.Select
                        name="itemId"
                        label="Select Item"
                        options={itemOptions}
                        value={values.itemId}
                        onChange={handleInputChange}
                        error={errors.itemId}
                        onClick={setQty()}
                    />

                    <Controls.Input
                        name="availableQty"
                        label="Available Quantity"
                        value={values.availableQty}
                        onChange={handleInputChange}
                        type='number'
                        error={errors.availableQty}
                        disabled={true}
                    />

                    <Controls.Input
                        name="quantity"
                        label="Quantity"
                        value={values.quantity}
                        onChange={handleInputChange}
                        type='number'
                        error={errors.quantity}
                    />

                    <Controls.Input
                        name="amount"
                        label="Amount"
                        value={values.amount}
                        onChange={handleInputChange}
                        type='number'
                        error={errors.amount}
                    />
                </Grid>
                
                <Grid item xs={4}>
                    <Controls.Button
                        style={{margin: 10, marginTop:'70px', maxWidth: '60px', minWidth: '100px'}}
                        text="Add"
                        onClick={addValue}
                    />
                    <Controls.Button
                        style={{margin: 10}}
                        color="error"
                        onClick={handleSubmit}
                        text="Submit"
                        disabled={disableSubmit}
                    />

                    <Controls.Button
                        style={{margin: 10, maxWidth: '60px', minWidth: '100px'}}
                        color="inherit"
                        text="Reset"
                        onClick={resetForm}
                    />
                </Grid>
            </Grid>
        </Form>
        {recordList.length > 0 ? 
        <TblContainer>
            <TblHead/>
            <TableBody>
                {   
                    recordsAfterPagingAndSorting().map(item =>
                        (<TableRow key={item.id}>
                            <TableCell>{item.itemName}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.amount}</TableCell>
                        </TableRow>)
                    )
                }
            </TableBody>
            </TblContainer>
        : null }
        {recordList.length > 0 ? <TblPagination/> : null }
        </Paper>
        
    );
}

