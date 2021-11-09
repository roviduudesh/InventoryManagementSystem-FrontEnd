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
import UserForm from './UserForm';
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

// const headCells = [
//     {id: 'supName', label:'Supplier Name'},
//     {id: 'address1', label:'Address Line 1'},
//     {id: 'address2', label:'Address Line 2'},
//     {id: 'address3', label:'Address Line 3'},
//     {id: 'email', label:'Email'},
//     {id: 'contact', label:'Contact Numbers', disableSorting: true},
//     {id: 'actions', label:'Actions', disableSorting: true}
// ]

export default function User(props) {

    const {setLoading, user} = props;
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
        {id: 'userName', label:'Username'},
        {id: 'password', label:'Password'},        
        {id: 'level', label:'Level'},
        {id: 'contact', label:'Contact Number', disableSorting: true},
        {id: 'actions', label:'Actions', disableSorting: true},
    ]
    
    useEffect(() => {
        
        console.log('user', user.level)
        if(user.level == 'admin'){ 
            setLoading(true);
            axios.get('http://localhost:8080/api/v1/user/all')
            .then((function (response){
                // console.log("response.data", response.data)
                setRecords(response.data.data)
                setLoading(false);
            }))
        } else{
            setLoading(true);
            axios.get('http://localhost:8080/api/v1/user/profile', {params : {userId: user.id}})
            .then((function (response){
                console.log("response.data", response.data.data)
                setRecords(response.data.data)
                setLoading(false);
            }))
        }setLoading(false);
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

    const addOrEdit = (user, resetForm) => {
        
        setLoading(true);
        if(user.id == 0){
            console.log('user', user)
            axios.post('http://localhost:8080/api/v1/user', user)
            .then(response => {
                // console.log("Status: ", response.status);
                console.log("response.data: ", response.data);
                setLoading(false);
                let type = response.data.status == 200 ? 'success' : 'error';               
                notification(true, response.data.message, type);
            }).catch(error => {
                console.log('Something went wrong!', error);
            });
        }
        else{
            console.log('userput', user)
            axios.put('http://localhost:8080/api/v1/user/' + user.id, user)
            .then(response => {
                console.log("Status: ", response.status);
                console.log("Message: ", response);
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
        axios.delete('http://localhost:8080/api/v1/user/'+ id)
        .then(response => {
            setLoading(false);
            let type = response.data.status == 200 ? 'success' : 'error';
            notification(true, response.data.message, type);
        }).catch(error => {
            console.log('Something went wrong!', error);
        });
    }

    return (
        user.level ? 
        <>
            <PageHeader
                title="User"
                subTitle={user.level == 'admin' ? 'View/ Add / Update / Delete Users' : 'Profile' }
                icon={<PeopleAltTwoToneIcon fontSize="large"/>}
            />
                <Paper className={classes.pageContent}>
                {user.level == 'admin' ?
                    <Toolbar>
                        <Controls.Input
                            className={classes.searchInput}
                            label="Search Users"
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
                    : null }
                    <TblContainer>
                        <TblHead/>
                        <TableBody>
                            {
                                recordsAfterPagingAndSorting().map(item =>
                                    (<TableRow key={item.id}>
                                        <TableCell>{item.firstName}</TableCell>
                                        <TableCell>{item.lastName}</TableCell>
                                        <TableCell>{item.userName}</TableCell>
                                        <TableCell>{item.password}</TableCell>
                                        <TableCell>{item.level}</TableCell>
                                        <TableCell>{item.contact}</TableCell>
                                        
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
                                                {user.level == 'admin' ?
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
                                                    : null }
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
                title="User Form"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <UserForm
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
