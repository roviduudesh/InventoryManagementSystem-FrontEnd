import React, {useEffect, useState} from 'react';
import axios from "axios";
import CreateIcon from '@mui/icons-material/Create';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
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
import ItemForm from "./ItemForm";
import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";

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
    {id: 'name', label:'Item Name'},
    {id: 'price', label:'Item Price'},
    {id: 'quantity', label:'Item Quantity'},
    {id: 'warranty', label:'Item Warranty'},
    {id: 'actions', label:'Actions', disableSorting: true}
]

export default function Item(props) {

    const {loading, setLoading} = props;
    const [recordForEdit, setRecordForEdit] = useState(null);
    const classes = useStyles();
    const [records, setRecords] = useState([]);
    const [filterFn, setFilterFn] = useState({fn: items => {return items;}})
    const [openPopup, setOpenPopup] = useState(false);
    const [notify, setNotify] = useState({isOpen:false, message:'', type:''});
    const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title:'', subTitle:''})

    useEffect(() => {
        setLoading(true);
        console.log('useEffect')
        axios.get('http://localhost:8080/api/v1/item/all')
        .then((function (response){
            console.log("response.data", response.data)
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
                    return items.filter(x => x.name.toLowerCase().includes(target.value.toLowerCase()))
            }
        })
    }

    const addOrEdit = (item, resetForm) => {
        console.log('item', item)
        setLoading(true);
        if(item.id == 0){
            axios.post('http://localhost:8080/api/v1/item', item)
            .then(response => {
                setLoading(false);
                notification(true, response.data.message, 'success');
            }).catch(error => {
                console.log('Something went wrong!', error);
            });
        }
        else{
            console.log('AAAA')
            axios.put('http://localhost:8080/api/v1/item/' + item.id, item)
            .then(response => {
                console.log("Status: ", response.status);
                console.log("Message: ", response);
                setLoading(false);
                notification(true, response.data.message, 'success');
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

        // supplierService.deleteSupplier(id);
        // setRecords(supplierService.getAllSuppliers());
        axios.delete('http://localhost:8080/api/v1/item/'+ id)
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

        <>
            <PageHeader
                title="Item"
                subTitle="View/ Add / Update / Delete Items"
                icon={<AppRegistrationIcon fontSize="large"/>}
            />
            {/*{loading ? <div>Loading....</div> :*/}
                <Paper className={classes.pageContent}>
                    {/*<Paper style={{margin: 'auto', padding: 20, width: '60%'}}>*/}

                    <Toolbar>
                        <Controls.Input
                            className={classes.searchInput}
                            label="Search Items"
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
                            onClick={() => {
                                setOpenPopup(true);
                                setRecordForEdit(null);
                            }}
                        />
                    </Toolbar>
                    <TblContainer>
                        <TblHead/>
                        <TableBody>
                            {
                                recordsAfterPagingAndSorting().map(item =>
                                    (<TableRow>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.price}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.warranty}</TableCell>
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
                title="Item Form"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <ItemForm
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
