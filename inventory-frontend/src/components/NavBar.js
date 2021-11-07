import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtnLink,
} from './NavBarElements';

const Navbar = () => {
  return (
    <>
      <Nav>
        {/* <NavLink to='/'> */}
          {/* <img src={require('../../images/logo.svg')} alt='logo' /> */}
        {/* </NavLink> */}
        <Bars />
        <NavMenu>
          <h1 style={{color:'white', padding:'20px', fontWeight:'bold'}}>Inventory Management System </h1>
          <NavLink to='/supplier' activeStyle>
            Suppliers
          </NavLink>
          <NavLink to='/customer' activeStyle>
            Customers
          </NavLink>
          <NavLink to='/item' activeStyle>
            Items
          </NavLink>
          <NavLink to='/stock' activeStyle>
            Stocks
          </NavLink>
          <NavLink to='/invoice' activeStyle>
            Invoices
          </NavLink>
          {/* Second Nav */}
          <NavBtnLink to='/logout'>Logout</NavBtnLink>
        </NavMenu>
        
      </Nav>
    </>
  );
};

export default Navbar;