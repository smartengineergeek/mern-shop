import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import './Navigation.css';
import Button from '../Button/Button';
import * as utils from '../../utils';

const data = [
    { id: "navLinkAddProduct", path: "/add-product" },
    { id: "navLinkAddProduct", path: "/edit-product" },
    { id: "navLinkAdmin", path: "/admin" },
    { id: "navLinkLogin", path: "/login" },
    { id: "navLinkSignup", path: "/signup" },
    { id: "navLinkShop", path: "/" }
];

function getPathById(id){
    let datum = data.find(datum => datum.id === id);
    return datum.path;
}

function getIdByPath(path){
    let datum = data.find(datum =>  path.indexOf(datum.path) > -1);
    // console.log("path ", path, "datum ", datum);
    return datum.id;
}

function Navigation(props){

    let id = getIdByPath(window.location.pathname);
    let [activeId, setActiveId] = useState(id);

    const clickHandler = event => {
        setActiveId(event.target.id);    
        props.history.push(getPathById(event.target.id));  
    }    

    return(
        <div className="nav">
            <div className="links">
                <ul className="ul-left">
                    <li>
                        <Button title="Shop" id="navLinkShop" isActive={activeId === "navLinkShop"? true: false} 
                            clickHandler={clickHandler} />
                    </li>
                    <li>
                        <Button title="Add Product" id="navLinkAddProduct" isActive={activeId === "navLinkAddProduct"? true: false}   
                            clickHandler={clickHandler} />
                    </li>
                    <li>
                        <Button title="Admin" id="navLinkAdmin" isActive={activeId === "navLinkAdmin"? true: false}    
                            clickHandler={clickHandler} />
                    </li>
                </ul>
                {utils.validate(props.username) ?
                <ul className="ul-right">
                    <li>Hi {props.username}!</li>
                    <li>
                        <Button title="Logout" clickHandler={props.logout} />
                    </li>
                </ul>:                
                <ul className="ul-right">
                    <li>
                        <Button title="Login" id="navLinkLogin" isActive={activeId === "navLinkLogin"? true: false} 
                            clickHandler={clickHandler} />
                    </li>
                    <li>
                        <Button title="Signup" id="navLinkSignup" isActive={activeId === "navLinkSignup"? true: false}   
                            clickHandler={clickHandler} />
                    </li>
                </ul>
                }
            </div>
        </div>
    )
}

export default withRouter(Navigation);