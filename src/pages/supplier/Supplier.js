import React, {useEffect, useState} from 'react';
import axios from "axios";
import CreateIcon from '@mui/icons-material/Create';
import PeopleAltTwoToneIcon from "@mui/icons-material/PeopleAltTwoTone";
import {ModeEditOutlined} from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import Search from "@mui/icons-material/Search"
import AddIcon from '@mui/icons-material/Add';
import Popup from "../../components/Popup";
import {makeStyles} from "@mui/styles";
import {InputAdornment, Paper, TableBody, TableCell, TableRow, Toolbar} from "@mui/material";
import useTable from "../../components/useTable"
import Controls from "../../components/controls/Controls";
import Notification from '../../components/Notification'
import ConfirmDialog from '../../components/ConfirmDialog'
import SupplierForm from "./SupplierForm";
import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";
import { base, supplierApi } from '../../enum/urls';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles(() =>({
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
//     {id: 'supName', label:'Supplier Name'},
//     {id: 'address1', label:'Address Line 1'},
//     {id: 'address2', label:'Address Line 2'},
//     {id: 'address3', label:'Address Line 3'},
//     {id: 'email', label:'Email'},
//     {id: 'contact', label:'Contact Numbers', disableSorting: true},
//     {id: 'actions', label:'Actions', disableSorting: true}
// ]

export default function Supplier(props) {

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
        {id: 'supName', label:'Supplier Name'},
        {id: 'address1', label:'Address Line 1'},
        {id: 'address2', label:'Address Line 2'},
        {id: 'address3', label:'Address Line 3'},
        {id: 'email', label:'Email'},
        {id: 'contact', label:'Contact Number', disableSorting: true},
        user && user.level == 'admin' ? {id: 'actions', label:'Actions', disableSorting: true} : null
    ]
    
    useEffect(() => {
        setLoading(true);
        // console.log('USER', user)
        axios.get(base.baseUrl + supplierApi.baseUrl + supplierApi.allSuppliers)
        .then((function (response){
            // console.log("response.data", response.data)
            setRecords(response.data.data)
            setLoading(false);
        }))
        // setUser(localStorage.getItem('user'))
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
                    return items.filter(x => x.supName.toLowerCase().includes(target.value.toLowerCase()))
            }
        })
    }

    const addOrEdit = (supplier, resetForm) => {
        setLoading(true);
        if(supplier.id == 0){
            axios.post(base.baseUrl + supplierApi.baseUrl, supplier)
            .then(response => {
                // console.log("Status: ", response.status);
                // console.log("response.data: ", response.data);
                setLoading(false);
                let type = response.data.status == 200 ? 'success' : 'error';               
                notification(true, response.data.message, type);
            }).catch(error => {
                console.log('Something went wrong!', error);
            });
        }
        else{
            axios.put(base.baseUrl + supplierApi.baseUrl + supplier.id, supplier)
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
        setLoading(true);
        axios.delete(base.baseUrl + supplierApi.baseUrl + id)
        .then(response => {
            setLoading(false);
            let type = response.data.status == 200 ? 'success' : 'error';
            notification(true, response.data.message, type);
        }).catch(error => {
            console.log('Something went wrong!', error);
        });
    }

    return (
        user && user.level ? 
        <>
            <PageHeader
                title="Supplier"
                subTitle="View/ Add / Update / Delete Suppliers"
                icon={<PeopleAltTwoToneIcon fontSize="large"/>}
            />
                <Paper className={classes.pageContent}>
                    <Grid item xs={10}>
                        <Toolbar>
                            <Controls.Input
                                className={classes.searchInput}
                                label="Search Suppliers"
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
                    </Grid>
                    
                    <TblContainer>
                        <TblHead/>
                        <TableBody>
                            {
                                recordsAfterPagingAndSorting().map(item =>
                                    (<TableRow key={item.id}>
                                        <TableCell>{item.supName}</TableCell>
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
                                        : null}
                                    </TableRow>)
                                )
                            }
                        </TableBody>
                    </TblContainer>
                    <TblPagination/>
                </Paper>
            {/*}*/}

            <Loader/>

            <Popup
                title="Supplier Form"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <SupplierForm
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
        : <div/>
    );
}
