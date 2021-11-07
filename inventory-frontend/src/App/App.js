import React, {useState} from "react";
import './App.css';
import {makeStyles} from "@mui/styles";
import {CssBaseline} from "@material-ui/core";
import Supplier from "../pages/supplier/Supplier";
import Customer from "../pages/customer/Customer";
import Item from "../pages/Item/Item";
import Stock from "../pages/Stock/Stock";
import Invoice from "../pages/Invoice/Invoice";
import NavBar from "../components/NavBar";
import Loader from "../components/Loader";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginForm from "../pages/Login/LoginForm";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
    appMain: {
        // paddingLeft: '320px',
        width: '100%'
    }
})

function App() {
    const classes = useStyles();
    const[loading, setLoading] = useState(false);
    const[user, setUser] = useState({});
    
  return (
      <>
        {/* <SideMenu/> */}
        <Loader
            loading = {loading}
        />
        <div className={classes.appMain}>
        <Router>
            
                <Switch>
                
                    <Route path='/' exact>
                        <LoginForm
                        setLoading = {setLoading}
                        setUser = {setUser}
                        />
                    </Route>
                    <Route path='/supplier'>
                        <NavBar/>
                        <Supplier
                            setLoading = {setLoading}
                            user = {user}
                            // loading = {loading}
                        />
                    </Route>
                    <Route path='/customer'>
                        <NavBar/>
                        <Customer
                            setLoading = {setLoading}
                            user = {user}
                        />
                    </Route>
                    <Route path='/item'>
                        <NavBar/>
                        <Item
                            setLoading = {setLoading}
                            user = {user}
                        />
                    </Route>
                    <Route path='/stock'>
                        <NavBar/>
                        <Stock
                            setLoading = {setLoading}
                            user = {user}
                        />
                    </Route>
                    <Route path='/invoice'>
                        <NavBar/>
                        <Invoice
                            setLoading = {setLoading}
                            user = {user}
                        />
                    </Route>
                    <Route path='/logout'>
                        <LoginForm
                            setLoading = {setLoading}
                            setUser = {setUser}
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

