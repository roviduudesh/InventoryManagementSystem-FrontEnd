import React, {useState} from "react";
import './App.css';
import SideMenu from "../components/SideMenu";
import {makeStyles} from "@mui/styles";
import Header from "../components/Header";
import {CssBaseline} from "@material-ui/core";
import Supplier from "../pages/supplier/Supplier";
import Customer from "../pages/customer/Customer";
import Item from "../pages/Item/Item";
import Stock from "../pages/Stock/Stock";
import Invoice from "../pages/Invoice/Invoice";
import NavBar from "../components/NavBar";
import Loader from "../components/Loader";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const useStyles = makeStyles({
    appMain: {
        // paddingLeft: '320px',
        width: '100%'
    }
})

function App() {
    const classes = useStyles();
    const[loading, setLoading] = useState(false);
  return (
      <>
        {/* <SideMenu/> */}
        <Loader
            loading = {loading}
        />
        <div className={classes.appMain}>
        <Router>
            <NavBar/>
                <Switch>
                    <Route path='/supplier'>
                        <Supplier
                            setLoading = {setLoading}
                            // loading = {loading}
                        />
                    </Route>
                    <Route path='/customer'>
                        <Customer
                            setLoading = {setLoading}
                        />
                    </Route>
                    <Route path='/item'>
                        <Item
                            setLoading = {setLoading}
                        />
                    </Route>
                    <Route path='/stock'>
                        <Stock
                            setLoading = {setLoading}
                        />
                    </Route>
                    <Route path='/invoice'>
                        <Invoice
                            setLoading = {setLoading}
                        />
                    </Route>
                </Switch>
        </Router>
            {/* <Header/> */}
        </div>
          <CssBaseline/>
      </>
  );
}

export default App;

