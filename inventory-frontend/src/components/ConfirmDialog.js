import React from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import Controls from './controls/Controls'

export default function ConfirmDialog(props) {

    const{confirmDialog, setConfirmDialog} = props;

    return (
        <Dialog open={confirmDialog.isOpen}>
            <DialogTitle>

            </DialogTitle>
            <DialogContent>
                <Typography variant="h6">
                    {confirmDialog.title}
                </Typography>
                <Typography variant="subtitle2">
                    {confirmDialog.subTitle}
                </Typography>
            </DialogContent>
            <DialogActions style={{padding:20}}>
                <Controls.Button
                    text="No"
                    color="inherit"
                    onClick={() => setConfirmDialog({  ...confirmDialog, isOpen:false})}
                />
                <Controls.Button
                    text="Yes"
                    color="error"
                    onClick={confirmDialog.onConfirm}
                />
            </DialogActions>
        </Dialog>
    );
}
