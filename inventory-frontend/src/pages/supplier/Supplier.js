import React, {useEffect, useState} from 'react';
import SupplierForm from "./SupplierForm";
import PeopleAltTwoToneIcon from "@mui/icons-material/PeopleAltTwoTone";
import PageHeader from "../../components/PageHeader";
import {InputAdornment, Paper, TableBody, TableCell, TableRow, Toolbar} from "@mui/material";
import useTable from "../../components/useTable"
import * as supplierService from "../../services/supplierService"
import {makeStyles} from "@mui/styles";
import Controls from "../../components/controls/Controls";
import Search from "@mui/icons-material/Search"
import AddIcon from '@mui/icons-material/Add';
import Popup from "../../components/Popup";
import axios from "axios";
import {getAllSuppliersAPI} from "../../services/supplierService";
import {ModeEditOutlined} from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import Notification from '../../components/Notification'
import ConfirmDialog from '../../components/ConfirmDialog'

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
    {id: 'supName', label:'Supplier Name'},
    {id: 'address1', label:'Address Line 1'},
    {id: 'address2', label:'Address Line 2'},
    {id: 'address3', label:'Address Line 3'},
    {id: 'email', label:'Email'},
    {id: 'contact', label:'Contact Numbers', disableSorting: true},
    {id: 'actions', label:'Actions', disableSorting: true}
]

export default function Supplier(props) {

    const [recordForEdit, setRecordForEdit] = useState(null);
    const classes = useStyles();
    const [records, setRecords] = useState(supplierService.getAllSuppliers())
    const [filterFn, setFilterFn] = useState({fn: items => {return items;}})
    const [openPopup, setOpenPopup] = useState(false);
    const [notify, setNotify] = useState({isOpen:false, message:'', type:''});
    const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title:'', subTitle:''})

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
        if(supplier.id == 0)
            supplierService.insertSupplier(supplier);
        else
            supplierService.updateSupplier(supplier);
        resetForm();
        setRecordForEdit(null);
        setOpenPopup(false);
        setRecords(supplierService.getAllSuppliers());
        setNotify({
            isOpen: true,
            message: 'Submitted Successfully',
            type: 'success'
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
        supplierService.deleteSupplier(id);
        setRecords(supplierService.getAllSuppliers());
        setNotify({
            isOpen: true,
            message: 'Deleted Successfully',
            type: 'error'
        })
    }

    return (
        <>
            <PageHeader
                title="Supplier"
                subTitle="View/ Add / Update / Delete Suppliers"
                icon={<PeopleAltTwoToneIcon fontSize="large"/>}
            />

            <Paper className={classes.pageContent}>
                {/*<Paper style={{margin: 'auto', padding: 20, width: '60%'}}>*/}

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
                    <Controls.Button
                        className={classes.newButton}
                        text="Add New"
                        variant="outlined"
                        startIcon={<AddIcon/>}
                        onClick={() => {setOpenPopup(true);setRecordForEdit(null);}}
                    />
                </Toolbar>
                <TblContainer>
                    <TblHead/>
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map(item =>
                                (<TableRow>
                                    <TableCell>{item.supName}</TableCell>
                                    <TableCell>{item.address1}</TableCell>
                                    <TableCell>{item.address2}</TableCell>
                                    <TableCell>{item.address3}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.contact}</TableCell>
                                    <TableCell>
                                        <Controls.ActionButton
                                            color="primary"
                                            onClick={()=> {openInPopup(item)}}
                                        >
                                            <ModeEditOutlined fontSize="small"/>
                                        </Controls.ActionButton>
                                        <Controls.ActionButton
                                            color="secondary"
                                            onClick={()=> {
                                                setConfirmDialog({
                                                    isOpen: true,
                                                    title:'Are you sure to delete this record ?',
                                                    subTitle: "You can' t undo this operation",
                                                    onConfirm: () => {onDelete(item.id)}
                                                })
                                            }}>
                                            <DeleteIcon fontSize="small"/>
                                        </Controls.ActionButton>
                                    </TableCell>
                                </TableRow>)
                            )
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination/>
            </Paper>

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
    );
}
