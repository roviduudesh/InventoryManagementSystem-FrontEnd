import React from "react";
import './App.css';
import SideMenu from "../components/SideMenu";
import {makeStyles} from "@mui/styles";
import Header from "../components/Header";
import {CssBaseline} from "@material-ui/core";
import Supplier from "../pages/supplier/Supplier";

const useStyles = makeStyles({
    appMain: {
        paddingLeft: '320px',
        width: '100%'
    }
})

function App() {
    const classes = useStyles();
  return (
      <>
        <SideMenu/>
        <div className={classes.appMain}>
            <Header/>

            <Supplier/>
        </div>
          <CssBaseline/>
      </>
  );
}

export default App;

