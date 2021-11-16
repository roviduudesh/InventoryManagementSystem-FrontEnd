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
import StockForm from "./StockForm";
import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";
import moment from 'moment';
import { base, stockApi, supplierApi, itemApi } from '../../enum/urls';

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
//     {id: 'stockDate', label:'Stock Date'},
//     {id: 'quantity', label:'Stock Quantity'},
//     {id: 'supplier', label:'Supplier'},
//     {id: 'item', label:'Item Name'},
//     {id: 'actions', label:'Actions', disableSorting: true}
// ]

export default function Stock(props) {

    const [disabled, setDisabled] = useState(false);
    const {setLoading, user, loading} = props;
    const [recordForEdit, setRecordForEdit] = useState(null);
    const classes = useStyles();
    const [records, setRecords] = useState([]);
    const [supplierOptions, setSupplierOptions] = useState([]);
    const [itemOptions, setItemOptions] = useState([]);
    const [filterFn, setFilterFn] = useState({fn: items => {return items;}})
    const [openPopup, setOpenPopup] = useState(false);
    const [notify, setNotify] = useState({isOpen:false, message:'', type:''});
    const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title:'', subTitle:''})

    const headCells = [
        {id: 'stockDate', label:'Stock Date'},
        {id: 'quantity', label:'Stock Quantity'},
        {id: 'supplier', label:'Supplier'},
        {id: 'item', label:'Item Name'},
        user.level == 'admin' ? {id: 'actions', label:'Actions', disableSorting: true} : null
    ]

    useEffect(() => {
        console.log('useEffect')
        
        setLoading(true);
        axios.get(base.baseUrl + supplierApi.baseUrl + supplierApi.supplierIdNameList)
        .then((function (response){
            // console.log("setSupplierOptions", response.data.data)
            setSupplierOptions(response.data.data)
            // setLoading(false);
        }))

        // setLoading(true);
        axios.get(base.baseUrl + itemApi.baseUrl + itemApi.itemIdNameList)
        .then((function (response){
            // console.log("setItemOptions", response.data.data)
            setItemOptions(response.data.data)
            // setLoading(false);
        }))

        // setLoading(true);
        axios.get(base.baseUrl + stockApi.baseUrl + stockApi.allstocks)
        .then((function (response){
            // console.log("response.data.data", response.data.data)
            setRecords(response.data.data)
            setLoading(false);
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
                else{
                    return items.filter(x => (moment(x.stockDate).format('DD/MMM/yyyy')).toLowerCase().includes(target.value.toLowerCase()))
                }
            }
        })
    }

    const addOrEdit = (stock, resetForm) => {
        console.log('stock', stock)
        setLoading(true);
        if(stock.id == 0){
            axios.post(base.baseUrl + stockApi.baseUrl, stock)
            .then(response => {
                setLoading(false);
                let type = response.data.status == 200 ? 'success' : 'error';
                notification(true, response.data.message, type);
            }).catch(error => {
                console.log('Something went wrong!', error);
            });
        }
        else{
            axios.put(base.baseUrl + stockApi.baseUrl + stock.id, stock)
            .then(response => {
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
        setDisabled(false);
    }

    const notification = (open, message, type) =>{
        setNotify({
            isOpen: open,
            message: message,
            type: type
        })
    }
    
    const openInPopup = item =>{
        setDisabled(true);
        setRecordForEdit(item)
        setOpenPopup(true);
    }

    // const onDelete = id => {
    //     setConfirmDialog({
    //         ...confirmDialog,
    //         isOpen: false
    //     })
    //     setLoading(true);

    //     axios.delete(base.baseUrl + stockApi.baseUrl + id)
    //     .then(response => {
    //         setLoading(false);
    //         let type = response.data.status == 200 ? 'success' : 'error';
    //         notification(true, response.data.message, type);
    //     }).catch(error => {
    //         console.log('Something went wrong!', error);
    //     });
    // }

    return (
        user.level && !loading?
            <>
                <PageHeader
                    title="Stock"
                    subTitle="View/ Add / Update / Delete Stocks"
                    icon={<PeopleAltTwoToneIcon fontSize="large"/>}
                />
                    <Paper className={classes.pageContent}>
                        {/*<Paper style={{margin: 'auto', padding: 20, width: '60%'}}>*/}

                        <Toolbar>
                            <Controls.Input
                                className={classes.searchInput}
                                label="Search Stocks"
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
                                    setDisabled(false);
                                }}
                            /> : null }
                        </Toolbar>
                        <TblContainer>
                            <TblHead/>
                            <TableBody>
                                {
                                    recordsAfterPagingAndSorting().map(item =>
                                        (<TableRow key={item.id}>
                                            <TableCell>{moment(item.stockDate).format('DD/MMM/yyyy')}</TableCell>
                                            {/* <TableCell>{item.stockDate}</TableCell> */}
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{item.supplierName}</TableCell>
                                            <TableCell>{item.itemName}</TableCell>
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
                                                    {/* <Controls.Button
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
                                                    </Controls.Button> */}
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

                <Loader/>

                <Popup
                    title="Stock Form"
                    openPopup={openPopup}
                    setOpenPopup={setOpenPopup}
                >
                    <StockForm
                        recordForEdit={recordForEdit}
                        addOrEdit={addOrEdit}
                        supplierOptions={supplierOptions}
                        itemOptions={itemOptions}
                        setLoading={setLoading}
                        disabled={disabled}
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
