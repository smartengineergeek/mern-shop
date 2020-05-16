import React, { useState } from 'react';

import './style.css';
import Login from './Login';
import Signup from './Signup';

export default function Tabs(props){
    let urlParams = new URLSearchParams(window.location.search);
    let activeTab = urlParams.get('active');
    const [active, setActive] = useState(activeTab);

    const data1 = "data1";

    return(
        <div className="index">
            <div className="tab">
                <div className={active === "login"? "active": ""} 
                    onClick={() => setActive('login')}>Login</div>
                <div className={active === "signup"? "active": ""} 
                    onClick={() => setActive('signup')}>Signup</div>
            </div>
            {username !== "" ? <div>{username}</div>:
                <React.Fragment>
                {active === "login" ? 
                    <Login setUser={setUser} data1={data1} />: 
                    <Signup /> 
                }
                </React.Fragment>
            }
        </div>
    )
}

