import React, {useState} from 'react';
import {makeStyles} from "@mui/styles";
import {Paper, TableBody, TableCell, TableRow} from "@mui/material";
import useTable from "../../components/useTable"

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

export default function ViewDetail(props) {

    const {recordForView} = props
    const [filterFn] = useState({fn: items => {return items;}})
    const classes = useStyles();

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(recordForView, headCells, filterFn);

    // const handleSearch = e => {
    //     let target = e.target;
    //     setFilterFn({
    //         fn: items => {
    //             if(target.value == "")
    //                 return items;
    //             else
    //                 return items.filter(x => x.supName.toLowerCase().includes(target.value.toLowerCase()))
    //         }
    //     })
    // }

    return (
        <Paper className={classes.pageContent}>      
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
            <TblPagination/>
        </Paper>
    );
}