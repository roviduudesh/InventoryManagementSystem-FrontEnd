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
    {id: 'stockDate', label:'Stock Date'},
    {id: 'quantity', label:'Stock Quantity'},
    {id: 'supplier', label:'Supplier'},
    {id: 'item', label:'Item Name'},
    {id: 'actions', label:'Actions', disableSorting: true}
]

export default function Stock(props) {

    const [disabled, setDisabled] = useState(false);
    const {loading, setLoading} = props;
    const [recordForEdit, setRecordForEdit] = useState(null);
    const classes = useStyles();
    const [records, setRecords] = useState([]);
    const [supplierOptions, setSupplierOptions] = useState([]);
    const [itemOptions, setItemOptions] = useState([]);
    const [filterFn, setFilterFn] = useState({fn: items => {return items;}})
    const [openPopup, setOpenPopup] = useState(false);
    const [notify, setNotify] = useState({isOpen:false, message:'', type:''});
    const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title:'', subTitle:''})

    useEffect(() => {
        console.log('useEffect')

        setLoading(true);
        axios.get('http://localhost:8080/api/v1/supplier/stock_supplier')
        .then((function (response){
            // console.log("setSupplierOptions", response.data.data)
            setSupplierOptions(response.data.data)
            setLoading(false);
        }))

        setLoading(true);
        axios.get('http://localhost:8080/api/v1/item/stock_item')
        .then((function (response){
            // console.log("setItemOptions", response.data.data)
            setItemOptions(response.data.data)
            setLoading(false);
        }))

        setLoading(true);
        axios.get('http://localhost:8080/api/v1/stock/all')
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
                else
                    return items.filter(x => x.stockDate.toLowerCase().includes(target.value.toLowerCase()))
            }
        })
    }

    const addOrEdit = (stock, resetForm) => {
        console.log('stock', stock)
        setLoading(true);
        if(stock.id == 0){
            axios.post('http://localhost:8080/api/v1/stock', stock)
            .then(response => {
                console.log("Status: ", response.status);
                console.log("Message: ", response);
                setLoading(false);
                notification(true, response.data.message, 'success');
            }).catch(error => {
                console.log('Something went wrong!', error);
            });
        }
        else{
            console.log('stock', stock)
            axios.put('http://localhost:8080/api/v1/stock/' + stock.id, stock)
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
        setDisabled(false);
    }

    const notification = (open, message, type) =>{
        // console.log('AAAAAAAA')
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

    const onDelete = id => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        setLoading(true);

        axios.delete('http://localhost:8080/api/v1/supplier/'+ id)
        .then(response => {
            // setLoading(false);
            // console.log("delete: ", response);
            setLoading(false);
            notification(true, response.data.message, 'success');
        }).catch(error => {
            console.log('Something went wrong!', error);
        });
    }

    return (

        <>
            <PageHeader
                title="Stock"
                subTitle="View/ Add / Update / Delete Stocks"
                icon={<PeopleAltTwoToneIcon fontSize="large"/>}
            />
            {/*{loading ? <div>Loading....</div> :*/}
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
                            onClick={() => {
                                setOpenPopup(true);
                                setRecordForEdit(null);
                                setDisabled(false);
                            }}
                        />
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
                title="Stock Form"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <StockForm
                    recordForEdit={recordForEdit}
                    addOrEdit={addOrEdit}
                    supplierOptions={supplierOptions}
                    itemOptions={itemOptions}
                    loading={loading}
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
    );
}
