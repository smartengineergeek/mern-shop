import React from 'react';

import './Button.css';

const Button = props => (
<button className="app-btn" id={props.id} onClick={event => props.clickHandler(event)}>{props.title}</button>
);

export default Button;