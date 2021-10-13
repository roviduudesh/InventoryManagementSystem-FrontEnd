import React from 'react';
import {AppBar, Grid, InputBase, Toolbar} from "@material-ui/core";

export default function Header() {
    return (
        <AppBar position="static" style={{backgroundColor:'#fff', transform: 'translateZ(0)'}}>
            <Toolbar>
                <Grid container>
                    <Grid item sm>
                        <InputBase
                            placeholder="Search"
                        />
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}