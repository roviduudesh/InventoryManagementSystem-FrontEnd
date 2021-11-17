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
import User from "../pages/user/User";
import AAAAAA from "../pages/Login/AAAAAA";

const useStyles = makeStyles({
    appMain: {
        // paddingLeft: '320px',
        width: '100%'
    }
})

function App() {
    const classes = useStyles();
    const[loading, setLoading] = useState(false);
    // const[user, setUser] = useState({});
    const[user, setUser] = useState(localStorage.getItem('user'));
    
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
                        <NavBar
                            user = {user}
                        />
                        <Supplier
                            setLoading = {setLoading}
                            user = {user}
                            setUser= {setUser}
                            // loading = {loading}
                        />
                    </Route>
                    <Route path='/customer'>
                        <NavBar
                            user = {user}
                        />
                        <Customer
                            setLoading = {setLoading}
                            user = {user}
                        />
                    </Route>
                    <Route path='/item'>
                        <NavBar
                            user = {user}
                        />
                        <Item
                            setLoading = {setLoading}
                            user = {user}
                        />
                    </Route>
                    <Route path='/stock'>
                        <NavBar
                            user = {user}
                        />
                        <Stock
                            setLoading = {setLoading}
                            user = {user}
                        />
                    </Route>
                    <Route path='/invoice'>
                        <NavBar
                            user = {user}
                        />
                        <Invoice
                            setLoading = {setLoading}
                            user = {user}
                        />
                    </Route>
                    <Route path='/user'>
                        <NavBar
                            user = {user}
                        />
                        <User
                            setLoading = {setLoading}
                            user = {user}
                        />
                    </Route>
                    <Route path='/logout'>
                        <AAAAAA
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

