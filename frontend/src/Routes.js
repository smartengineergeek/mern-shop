import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Products from './pages/Products/Products';
import AddProduct from './pages/AddProduct/AddProduct';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import * as util from './util';
const pageNotFoundImage = require('./404.jpg');

export default function Routes(props){
    if(util.validate(document.getElementById("navLinkShop")))
        document.getElementById("navLinkShop").classList.add('active');
    
    const setUser = username => {
        props.setUser(username);
    }

    return(
        <Switch>
            <Route exact path="/" component={Products} />
            <Route exact path="/add-product" component={AddProduct} />
            <Route path="/edit-product/:productId" component={AddProduct} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" render={props => <Login {...props} setUser={setUser}  />} />
            <Route component={NotFound} />
        </Switch>
    )
}

const NotFound = () => (
    <>
        <center>Page Not Found 404</center>
        <img src={pageNotFoundImage} alt="not available" style={{"height": "100%", "width": "100%"}}/>
    </>
)