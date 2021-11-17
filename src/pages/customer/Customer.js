import React, {useEffect, useState} from 'react';
import PeopleAltTwoToneIcon from "@mui/icons-material/PeopleAltTwoTone";
import {InputAdornment, Paper, TableBody, TableCell, TableRow, Toolbar} from "@mui/material";
import {makeStyles} from "@mui/styles";
import Search from "@mui/icons-material/Search"
import AddIcon from '@mui/icons-material/Add';
import {ModeEditOutlined} from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import axios from 'axios';
import CustomerForm from "./CustomerForm";
import PageHeader from "../../components/PageHeader";
import useTable from "../../components/useTable"
import Controls from "../../components/controls/Controls";
import Popup from "../../components/Popup";
import Notification from '../../components/Notification'
import ConfirmDialog from '../../components/ConfirmDialog'
import { base,customerApi } from '../../enum/urls';

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

// const headCells = [
//     {id: 'firstName', label:'First Name'},
//     {id: 'lastName', label:'Last Name'},
//     {id: 'address1', label:'Address Line 1'},
//     {id: 'address2', label:'Address Line 2'},
//     {id: 'address3', label:'Address Line 3'},
//     {id: 'email', label:'Email'},
//     {id: 'contact', label:'Contact Numbers', disableSorting: true},
//     {id: 'actions', label:'Actions', disableSorting: true}
// ]

export default function Customer(props) {

    const {setLoading} = props;
    const [user] = useState(JSON.parse(window.localStorage.getItem('user')));
    const [recordForEdit, setRecordForEdit] = useState(null);
    const classes = useStyles();
    const [records, setRecords] = useState([]);
    const [filterFn, setFilterFn] = useState({fn: items => {return items;}})
    const [openPopup, setOpenPopup] = useState(false);
    const [notify, setNotify] = useState({isOpen:false, message:'', type:''});
    const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title:'', subTitle:''})

    const headCells = [
        {id: 'firstName', label:'First Name'},
        {id: 'lastName', label:'Last Name'},
        {id: 'address1', label:'Address Line 1'},
        {id: 'address2', label:'Address Line 2'},
        {id: 'address3', label:'Address Line 3'},
        {id: 'email', label:'Email'},
        {id: 'contact', label:'Contact Number', disableSorting: true},
        user && user.level == 'admin' ? {id: 'actions', label:'Actions', disableSorting: true} : null
    ]

    useEffect(() => {
        setLoading(true);
        console.log('useEffect')
        axios.get(base.baseUrl + customerApi.baseUrl + customerApi.allCustomers)
        .then((function (response){
            // console.log("response.data", response.data)
            setRecords(response.data.data)
            setLoading(false);
            // return list;
        }))
    }, [notify]);
   
    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if(target.value == "")
                    return items;
                else
                    return items.filter(x => (x.firstName + x.lastName).toLowerCase().includes(target.value.toLowerCase()))
            }
        })
    }

    const addOrEdit = (customer, resetForm) => {
        setLoading(true);
        if(customer.id == 0){
            axios.post(base.baseUrl + customerApi.baseUrl , customer)
            .then(response => {
                // console.log("Status: ", response.status);
                // console.log("Message: ", response);
                setLoading(false);
                let type = response.data.status == 200 ? 'success' : 'error';
                notification(true, response.data.message, type);
            }).catch(error => {
                console.log('Something went wrong!', error);
            });
        }
        else{
            console.log('customer ', customer);
            axios.put(base.baseUrl + customerApi.baseUrl + customer.id, customer)
            .then(response => {
                // console.log("Status: ", response.status);
                // console.log("Message: ", response);
                setLoading(false);
                let type = response.data.status == 200 ? 'success' : 'error';
                notification(true, response.data.message, type);
            }).catch(error => {
                console.log('Something went wrong!', error);
            });
        }
        resetForm();
        setRecordForEdit(null);
        setOpenPopup(false);
    }

    const notification = (open, message, type) =>{
        setNotify({
            isOpen: open,
            message: message,
            type: type
        })
    }

    const openInPopup = item =>{
        setRecordForEdit(item)
        setOpenPopup(true);
    }

    const onDelete = id => {

        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        axios.delete(base.baseUrl + customerApi.baseUrl + id)
        .then(response => {
            // setLoading(false);
            console.log("delete: ", response);
            setLoading(false);
            notification(true, response.data.message, 'success');
        }).catch(error => {
            console.log('Something went wrong!', error);
        });
    }

    return (
        user && user.level ? 
            <>
                <PageHeader
                    title="Customer"
                    subTitle="View/ Add / Update / Delete Customers"
                    icon={<PeopleAltTwoToneIcon fontSize="large"/>}
                />
                {/*{loading ? <div>Loading....</div> :*/}
                    <Paper className={classes.pageContent}>
                        {/*<Paper style={{margin: 'auto', padding: 20, width: '60%'}}>*/}

                        <Toolbar>
                            <Controls.Input
                                className={classes.searchInput}
                                label="Search Customers"
                                InputProps={{
                                    startAdornment: (<InputAdornment position='start'>
                                        <Search/>
                                    </InputAdornment>)
                                }}
                                onChange={handleSearch}
                            />
                            {user.level == 'admin' ? 
                            <Controls.Button
                                className={classes.newButton}
                                text="Add New"
                                variant="outlined"
                                startIcon={<AddIcon/>}
                                onClick={() => {
                                    setOpenPopup(true);
                                    setRecordForEdit(null);
                                }}
                            /> : null }
                        </Toolbar>
                        <TblContainer>
                            <TblHead/>
                            <TableBody>
                                {
                                    recordsAfterPagingAndSorting().map(item =>
                                        (<TableRow key={item.id}>
                                            <TableCell>{item.firstName}</TableCell>
                                            <TableCell>{item.lastName}</TableCell>
                                            <TableCell>{item.address1}</TableCell>
                                            <TableCell>{item.address2}</TableCell>
                                            <TableCell>{item.address3}</TableCell>
                                            <TableCell>{item.email}</TableCell>
                                            <TableCell>{item.contact}</TableCell>
                                            {user.level == 'admin' ?
                                                <TableCell>
                                                    {/*Update data*/}
                                                    <Controls.Button
                                                        style={{marginRight: 10, paddingLeft: 20}}
                                                        size="small"
                                                        startIcon={<CreateIcon/>}
                                                        color="primary"
                                                        onClick={() => {
                                                            openInPopup(item)
                                                        }}
                                                    >
                                                        <ModeEditOutlined fontSize="small"/>
                                                    </Controls.Button>

                                                    {/*Delete data*/}
                                                    <Controls.Button
                                                        style={{marginRight: 10, paddingLeft: 20}}
                                                        size="small"
                                                        startIcon={<DeleteIcon/>}
                                                        color="error"
                                                        onClick={() => {
                                                            setConfirmDialog({
                                                                isOpen: true,
                                                                title: 'Are you sure to delete this record ?',
                                                                subTitle: "You can' t undo this operation",
                                                                onConfirm: () => {
                                                                    onDelete(item.id)
                                                                }
                                                            })
                                                        }}>
                                                        <DeleteIcon fontSize="small"/>
                                                    </Controls.Button>
                                                </TableCell> 
                                            : null }
                                        </TableRow>)
                                    )
                                }
                            </TableBody>
                        </TblContainer>
                        <TblPagination/>
                    </Paper>
                {/*}*/}

                <Popup
                    title="Customer Form"
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                >
                    <CustomerForm
                        recordForEdit={recordForEdit}
                        addOrEdit={addOrEdit}
                    />
                </Popup>

                <Notification
                    notify={notify}
                    setNotify={setNotify}
                />
                <ConfirmDialog
                    confirmDialog={confirmDialog}
                    setConfirmDialog={setConfirmDialog}
                />
            </>
        : <div><h1>User Not Found !!!</h1></div>
    );
}
