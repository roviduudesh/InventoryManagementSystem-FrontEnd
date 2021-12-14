import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Navbar.css';
import ConfirmDialog from '../ConfirmDialog';
import { Grid } from '@material-ui/core';

export default function Navbar(props) {

  const [user] = useState(JSON.parse(window.localStorage.getItem('user')));
  
  const history = useHistory();
  const [click, setClick] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title:'', subTitle:''})

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  
  return (
    user && user.level ?
      <>
      <Grid item xs={12}>
        <nav className='navbar'>
          <Link to='/supplier' className='navbar-logo' onClick={closeMobileMenu}>
            Inventory Management System
          </Link>
          {/* <div className={'navbar-logo'}>Inventory Management System </div> */}
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/supplier' className='nav-links' onClick={closeMobileMenu}>
                Suppliers
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/customer' className='nav-links' onClick={closeMobileMenu}>
                Customers
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/item' className='nav-links' onClick={closeMobileMenu}>
                Items
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/stock' className='nav-links' onClick={closeMobileMenu}>
                Stocks
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/invoice' className='nav-links' onClick={closeMobileMenu}>
                Invoices
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/user' className='nav-links' onClick={closeMobileMenu}>
              {
              user ? user.level == 'admin' ? 'Users' : 'Profile' : null
              }
              </Link>
            </li>
            <li className='nav-item'>
              <ul className='nav-links' 
                onClick={() => {
                                setConfirmDialog({
                                    isOpen: true,
                                    title: 'Are you sure to logout ?',
                                    subTitle: "You will be redirected to login page",
                                    onConfirm: () => {
                                      history.push("/logout");
                                    }
                                })
                            }}>Logout</ul>

              
            </li>
          </ul>
        </nav>
        </Grid>
        <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
        />
      </>
      : <div><h1>User Not Found !!!</h1></div>
  );
}
