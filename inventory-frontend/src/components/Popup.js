import React from 'react';
import {Dialog, DialogContent, DialogTitle, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";
import Controls from "../components/controls/Controls";
import CloseIcon from '@mui/icons-material/Close';

const useStyles = makeStyles(theme => ({
    // dialogWrapper: {
    // //     width: '10',
    // // height: '100%',
    // // display: 'absolute',
    // // alignItems: 'center',
    // // justifyContent: 'center',
    // // backgroundColor: 'pink',
    // },
    dialogTitle:{
        paddingRight: "0px"
    }
}))

export default function Popup(props) {

    const {title, children, openPopup, setOpenPopup} = props;
    const classes = useStyles();

    return (
        <Dialog open={openPopup}>
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
            <DialogContent dividers  className={classes.dialogWrapper}>
                {children}
            </DialogContent>
        </Dialog>
    );
}
