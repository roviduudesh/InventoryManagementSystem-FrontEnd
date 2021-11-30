import React, {useEffect, useState} from 'react';
import axios from "axios";
import PeopleAltTwoToneIcon from "@mui/icons-material/PeopleAltTwoTone";
import {ModeEditOutlined} from "@mui/icons-material";
import Search from "@mui/icons-material/Search"
import AddIcon from '@mui/icons-material/Add';
import Popup from "../../components/Popup";
import {makeStyles} from "@mui/styles";
import {InputAdornment, Paper, TableBody, TableCell, TableRow, Toolbar} from "@mui/material";
import moment from 'moment';
import ViewListIcon from '@mui/icons-material/ViewList';
import useTable from "../../components/useTable"
import Controls from "../../components/controls/Controls";
import Notification from '../../components/Notification'
import ConfirmDialog from '../../components/ConfirmDialog'
import InvoiceForm from "./InvoiceForm";
import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";
import ViewDetail from './ViewDetail';
import { base, customerApi, orderApi, itemApi} from '../../enum/urls';

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
//     {id: 'orderId', label:'Invoice'},
//     {id: 'orderDate', label:'Invoice Date'},
//     {id: 'customerName', label:'Customer Name'},
//     {id: 'amount', label:'Total Amount'},
//     {id: 'actions', label:'View Details', disableSorting: true}
// ]

export default function Invoice(props) {

    const {setLoading, loading} = props;
    const [user] = useState(JSON.parse(window.localStorage.getItem('user')));
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [recordForView, setRecordForView] = useState(null);
    const [recordList, setRecordList] = useState([]);
    const classes = useStyles();
    const [records, setRecords] = useState([]);
    const [filterFn, setFilterFn] = useState({fn: items => {return items;}})
    const [openPopupDetail, setOpenPopupDetail] = useState(false);
    const [openPopupAdd, setOpenPopupAdd] = useState(false);
    const [notify, setNotify] = useState({isOpen:false, message:'', type:''});
    const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title:'', subTitle:''})
    const [itemOptions, setItemOptions] = useState([]);
    const [itemQty, setItemQty] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);

    const headCells = [
        {id: 'orderId', label:'Invoice'},
        {id: 'orderDate', label:'Invoice Date'},
        {id: 'customerName', label:'Customer Name'},
        {id: 'amount', label:'Total Amount'},
        {id: 'actions', label:'View Details', disableSorting: true},
    ]

    useEffect(() => {
        setLoading(true);
        axios.get(base.baseUrl + customerApi.baseUrl + customerApi.customerIdNameList)
        .then((function (response){
            // console.log("customer", response.data.data)
            setCustomerOptions(response.data.data)
            // setLoading(false);
        }))

        setLoading(true);
        axios.get(base.baseUrl + itemApi.baseUrl + itemApi.itemIdNameList)
        .then((function (response){
            // console.log("setItemOptions", response.data.data)
            setItemOptions(response.data.data)
            // setLoading(false);
        }))

        setLoading(true);
        axios.get(base.baseUrl + itemApi.baseUrl + itemApi.itemIdQtyList)
        .then((function (response){
            // console.log("setItemQtyOptions", response.data.data)
            setItemQty(response.data.data)
            // setLoading(false);
        }))

        setLoading(true);
        // console.log('useEffect')
        axios.get(base.baseUrl + orderApi.baseUrl + orderApi.allOrders)
        .then((function (response){
            // console.log("allOrders", response.data)
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
                    return items.filter(x => x.orderId.includes(target.value))
            }
        })
    }

    const addOrEdit = (supplier, resetForm) => {
        setLoading(true);
            // console.log('supplier', supplier)
            axios.post(base.baseUrl + orderApi.baseUrl, supplier)
            .then(response => {
                // console.log("Status: ", response.status);
                // console.log("Message: ", response);
                setLoading(false);
                notification(true, response.data.message, 'success');
            }).catch(error => {
                console.log('Something went wrong!', error);
            });
        
        resetForm();
        setRecordForEdit(null);
        setOpenPopupAdd(false);
    }

    const addToTable = (order, resetForm) => {
        let cusName;
        // console.log('order', order)
        if(order.customerId){
            cusName = customerOptions.filter( function (cus) {
                return cus.id == order.customerId;
            })[0].name;
        }
        let itemName = itemOptions.filter( function (item) {
            return item.id == order.itemId;
        })[0].name;
          
        order.id = recordList.length;
        order.customerName = cusName;
        order.itemName = itemName;
        order.userId = user.id;

        setRecordList([...recordList, order]);

        resetForm();
        // console.log('values', order)
        // console.log('recordList', recordList)
    }

    const notification = (open, message, type) =>{
        // console.log('AAAAAAAA')
        setNotify({
            isOpen: open,
            message: message,
            type: type
        })
    }
    
    // const openInPopup = item =>{
    //     setRecordForEdit(item)
    //     // setOpenPopup(true);
    // }

    const openViewDetail = item =>{
        // console.log('item', item.orderItemList);
        setRecordForView(item.orderItemList)
        setOpenPopupDetail(true);
    }

    // const onDelete = id => {
    //     setConfirmDialog({
    //         ...confirmDialog,
    //         isOpen: false
    //     })
    //     setLoading(true);

    //     // supplierService.deleteSupplier(id);
    //     // setRecords(supplierService.getAllSuppliers());
    //     axios.delete('http://localhost:8080/api/v1/invoice/'+ id)
    //     .then(response => {
    //         // setLoading(false);
    //         console.log("delete: ", response);
    //         setLoading(false);
    //         notification(true, response.data.message, 'success');
    //     }).catch(error => {
    //         console.log('Something went wrong!', error);
    //     });
    // }

    return (
        user && user.level && !loading ?
            <>
                <PageHeader
                    title="Invoice"
                    subTitle="View/ Add / Update / Delete Invoices"
                    icon={<PeopleAltTwoToneIcon fontSize="large"/>}
                />
        
                <Paper className={classes.pageContent}>
                    <Toolbar>
                        <Controls.Input
                            className={classes.searchInput}
                            label="Search Invoices"
                            InputProps={{
                                startAdornment: (<InputAdornment position='start'>
                                    <Search/>
                                </InputAdornment>)
                            }}
                            onChange={handleSearch}
                        />
                        {/* { user.level == 'admin' ? */}
                            <Controls.Button
                                className={classes.newButton}
                                text="Add New"
                                variant="outlined"
                                startIcon={<AddIcon/>}
                                onClick={() => {
                                    setOpenPopupAdd(true);
                                    setRecordForEdit(null);
                                    setRecordList([]);
                                }}
                            />
                        {/* : null } */}
                    </Toolbar>
                    <TblContainer>
                        <TblHead/>
                        <TableBody>
                            {
                                recordsAfterPagingAndSorting().map(item =>
                                    (<TableRow key={item.orderId}>
                                        <TableCell>{item.orderId}</TableCell>
                                        <TableCell>{moment(item.orderDate).format('DD/MMM/yyyy')}</TableCell>
                                        <TableCell>{item.customerName}</TableCell>
                                        <TableCell>{item.totalAmount}</TableCell>
                                        <TableCell>
                                            {/*Update data*/}
                                            <Controls.Button
                                                style={{marginRight: 10, paddingLeft: 20}}
                                                size="small"
                                                startIcon={<ViewListIcon/>}
                                                color="primary"
                                                onClick={() => {
                                                    openViewDetail(item)
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
                                    </TableRow>)
                                )
                            }
                        </TableBody>
                    </TblContainer>
                    <TblPagination/>
                </Paper>
                
                <Loader/>

                <Popup
                    title="Invoice Details"
                    openPopup={openPopupDetail}
                    setOpenPopup={setOpenPopupDetail}
                >
                    <ViewDetail
                        recordForView={recordForView}
                    />
                </Popup>

                <Popup
                    title="Invoice Form"
                    openPopup={openPopupAdd}
                    setOpenPopup={setOpenPopupAdd}
                >
                    <InvoiceForm
                        recordForEdit={recordForEdit}
                        addOrEdit={addOrEdit}
                        recordList={recordList}
                        setRecordList={setRecordList}
                        customerOptions={customerOptions}
                        itemOptions={itemOptions}
                        addToTable={addToTable}
                        itemQty={itemQty}
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
