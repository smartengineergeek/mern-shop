import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import './Navigation.css';
import Button from '../Button/Button';

const data = [
    { id: "navLinkShop", path: "/" },
    { id: "navLinkAddProduct", path: "/add-product" },
    { id: "navLinkAddProduct", path: "/edit-product" },
    { id: "navLinkAdmin", path: "/admin" },
    { id: "navLinkLogin", path: "/login" },
    { id: "navLinkSignup", path: "/signup" }
];

function getPathById(id){
    let datum = data.find(datum => datum.id === id);
    return datum.path;
}

function getIdByPath(path){
    let datum = data.find(datum =>  path.includes(datum.path) );
    return datum.id;
}

const select = id => {
    data.forEach(datum => {
        document.getElementById(datum.id).classList.remove('active');
    })
    document.getElementById(id).classList.add('active');      
}

class Navigation extends Component {
    componentDidMount(){
        let path = window.location.pathname;
        select(getIdByPath(path));    
    }

    clickHandler = event => {    
        select(event.target.id);
        this.props.history.push(getPathById(event.target.id));  
    }    

    render(){
        return(
            <div className="nav">
                <div className="links">
                    <ul className="ul-left">
                        <li><Button title="Shop" id="navLinkShop" clickHandler={this.clickHandler} /></li>
                        <li><Button title="Add Product" id="navLinkAddProduct" clickHandler={this.clickHandler} /></li>
                        <li><Button title="Admin" id="navLinkAdmin" clickHandler={this.clickHandler} /></li>
                    </ul>
                    {this.props.username === "" ?
                    <ul className="ul-right">
                        <li><Button title="Login" id="navLinkLogin" clickHandler={this.clickHandler} /></li>
                        <li><Button title="Signup" id="navLinkSignup" clickHandler={this.clickHandler} /></li>
                    </ul>:
                    <ul className="ul-right">
                        <li>Hi {this.props.username}!</li>
                    </ul>
                    }
                </div>
            </div>
        )
    }
}

export default withRouter(Navigation);