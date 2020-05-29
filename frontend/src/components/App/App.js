import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';

import Navigation from '../Navigation/Navigation';
import Products from '../../pages/Products/Products';
import AddProduct from '../../pages/AddProduct/AddProduct';
import Signup from '../../pages/Auth/Signup';
import Login from '../../pages/Auth/Login';
import './App.css';
// import * as utils from '../../utils';
import Cart from '../../pages/Cart/Cart';
const pageNotFoundImage = require('../../404.jpg');

class App extends Component {

  state = {
    isAuth: false,
    token: null,
    username: '',
    userId: ""
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
    const userId = localStorage.getItem('userId');
//    console.log("username ", username, "token ", token, "expiryDate ", expiryDate)
    const remainingMilliseconds = new Date(expiryDate).getTime() - new Date().getTime();
    this.setAutoLogout(remainingMilliseconds);
    this.setState({ isAuth: true, token, username, userId });
  }

  setAutoLogout = milliseconds => {
    setTimeout(() => {
        this.logoutHandler();
    }, milliseconds);
  }

  logoutHandler = () => {
    this.setState({ isAuth: false, token: null, username: "", userId: "" });
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  }

  setUser = user => {
    this.setState({ username: user.username, userId: user.userId, token: user.token, isAuth: true });
  }

  productsComp = (props, isAdmin) => ( 
    <Products isAdmin={isAdmin} 
      isAuth={this.state.isAuth} 
      userId={this.state.userId} token={this.state.token} 
      {...props} 
    />
  )

  addProductComp = props => (
    <AddProduct token={this.state.token} {...props} />
  )

  render(){
    let { username, userId } = this.state;
    let routes = (
      <Switch>
        <Route exact path="/" render={props => this.productsComp(props, false)} />
        <Route exact path="/signup" render={props => <Signup {...props} />} />
        <Route exact path="/login" 
          render={props => <Login {...props} 
          setUser={this.setUser} 
            logoutHandler={this.logoutHandler}   
            setAutoLogout={this.setAutoLogout} />} 
        />
        {/* <Route exact path="/admin" component={NoAuth} />
        <Route exact path="/add-product" component={NoAuth} /> */}
        <Route component={NotFound} />
      </Switch>
    );
    if(this.state.isAuth){
      routes = (
        <Switch>
          <Route exact path="/" render={props => this.productsComp(props, false)} />
          <Route exact path="/add-product" render={props => this.addProductComp(props)} />
          <Route exact path="/admin" render={props => this.productsComp(props, true)} />
          <Route exact path="/cart" render={props => <Cart token={this.state.token} />} />
          <Route path="/edit-product/:productId" render={props => this.addProductComp(props)} />
          <Route component={NotFound} />
        </Switch>
      );
    }
    return (
      <>
        <Navigation username={username} userId={userId} logout={this.logoutHandler} />
        {routes}
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

const NoAuth = () => (
  <center>
    Please <Link to="/login">Login</Link> or 
    &nbsp;<Link to="/signup">Signup</Link>      
  </center>      
);

export default App;
