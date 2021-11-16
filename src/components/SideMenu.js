import React from 'react';
import { withStyles } from '@mui/styles';

const style = {
    sideMenu: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        left: '0px',
        width: '320px',
        height: '100%',
        backgroundColor: 'darkblue'
    }
}

const SideMenu = (props) => {
    const { classes } = props;
    return (
        <div className={classes.sideMenu}>

        </div>
    );
}

export default withStyles(style)(SideMenu);
