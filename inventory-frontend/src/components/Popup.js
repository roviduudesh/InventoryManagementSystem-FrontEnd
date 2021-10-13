import React from 'react';
import {Dialog, DialogContent, DialogTitle, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import Controls from "../components/controls/Controls";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from "@mui/icons-material/Add";

const useStyles = makeStyles(theme => ({
    dialogWrapper: {
        padding: 2,
        position:'absolute',
        top: 5
    },
    dialogTitle:{
        paddingRight: "0px"
    }
}))

export default function Popup(props) {

    const {title, children, openPopup, setOpenPopup} = props;
    const classes = useStyles();

    return (
        <Dialog open={openPopup} maxWidth="md" classes={{ paper : classes.dialogWrapper}}>
            <DialogTitle className={classes.dialogTitle}>
                <div style={{display: 'flex'}}>
                    <Typography variant="h6" component="div" style={{flexGrow:1}}>
                        {title}
                    </Typography>
                    <Controls.Button style={{paddingRight:10}}
                        // text="Add New"
                        // variant="outlined"
                        startIcon = {<CloseIcon/>}
                        // onClick={() => setOpenPopup(true)}
                        color="error"
                        onClick={() => {setOpenPopup(false)}}>
                        <CloseIcon/>
                    </Controls.Button>
                </div>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </Dialog>
    );
}
