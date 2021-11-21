import React from 'react';
import {Card, Paper, Typography} from "@mui/material";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles(theme =>({
    root: {
        // backgroundColor: 'red'
    },
    pageHeader:{
        padding: 10,
        display: 'flex',
        marginBottom: 2,
        marginTop: 10
    },
    pageIcon:{
        display: 'inline-block',
        padding: 20,
        color: 'red '
    },
    pageTitle:{
        paddingLeft: 10,
    },
    pageSubTitle:{
        opacity:0.6,
        fontWeight: 'bold',
        fontStyle:'oblique'
    },

}))

function PageHeader(props) {

    const classes = useStyles();
    const {title, subTitle, icon} = props;

    return (
        <Paper elevation={0} square className={classes.root}>
            <div className={classes.pageHeader}>
                <Card className={classes.pageIcon}>
                    {icon}
                </Card>
                <div className={classes.pageTitle}>
                    <Typography
                    variant="h4"
                    component="div">
                        {title}</Typography>
                    <Typography className={classes.pageSubTitle}
                        variant="subtitle1"
                        component="div">
                        {subTitle}</Typography>
                </div>
            </div>
        </Paper>
    );
}

export default PageHeader;