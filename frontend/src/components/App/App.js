import React, { Component } from 'react';
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
    // console.log("username ", username, "token ", token, "expiryDate ", expiryDate)
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
    this.setState({ isAuth: false, token: null, username: "" });
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('username');
  }

  productsComp = props => ( 
    <Products isAdmin="true" token={this.state.token} {...props} />
  )

  addProductComp = props => (
    <AddProduct token={this.state.token} {...props} />
  )

  render(){
    let { username } = this.state;
    return (
      <>
        <Navigation username={username} logout={this.logoutHandler} />
        <Switch>
              <Route exact path="/" render={props => this.productsComp(props)} />
              <Route exact path="/add-product" render={props => this.addProductComp(props)} />
              <Route exact path="/admin" render={props => this.productsComp(props)} />
              <Route path="/edit-product/:productId" render={props => this.addProductComp(props)} />
              <Route exact path="/signup" render={props => <Signup {...props} />} />
              <Route exact path="/login" 
                render={props => <Login {...props} setUser={this.setUser} logoutHandler={this.logoutHandler}   
                setAutoLogout={this.setAutoLogout} />} />
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
