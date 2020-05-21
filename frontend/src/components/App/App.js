import React, { useState, Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Navigation from '../Navigation/Navigation';
import Products from '../../pages/Products/Products';
import AddProduct from '../../pages/AddProduct/AddProduct';
import Signup from '../../pages/Auth/Signup';
import Login from '../../pages/Auth/Login';
import './App.css';
import * as utils from '../../utils';

const pageNotFoundImage = require('../../404.jpg');

class App extends Component {

  state = {
    isAuth: false,
    token: null,
    username: ''
  }

  componentDidMount(){
    if(utils.validate(document.getElementById("navLinkShop")))
        document.getElementById("navLinkShop").classList.add('active');
        
    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    if(!token || !expiryDate){
      return;
    }
    if(new Date(expiryDate) <= new Date()){
      this.logoutHandler();
      return;
    }
    const username = localStorage.getItem('username');
    console.log("username ", username, "token ", token, "expiryDate ", expiryDate)
    const remainingMilliseconds = new Date(expiryDate).getTime() - new Date().getTime();
    this.setAutoLogout(remainingMilliseconds);
    this.setState({ isAuth: true, token: token, username: username });
  }

  setUser = username => {
    this.setState({ username });
  }

  setAutoLogout = milliseconds => {
    setTimeout(() => {
        this.logoutHandler();
    }, milliseconds);
  }
  
  logoutHandler = () => {
    this.setState({ isAuth: false, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
  }

 
  render(){
    let { username } = this.state;
    return (
      <>
        <Navigation username={username} />
        <Switch>
              <Route exact path="/" component={Products} />
              <Route exact path="/add-product" component={AddProduct} />
              <Route path="/edit-product/:productId" component={AddProduct} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/login" 
                render={props => <Login {...props} setUser={this.setUser}  
                logoutHandler={this.logoutHandler}   setAutoLogout={this.setAutoLogout} />} />
              <Route component={NotFound} />
        </Switch>
      </>
    );
  }
}

const NotFound = () => (
  <>
      <center>Page Not Found 404</center>
      <img src={pageNotFoundImage} alt="not available" style={{"height": "100%", "width": "100%"}}/>
  </>
);

export default App;
