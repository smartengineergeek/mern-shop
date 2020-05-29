import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './Cart.css';
import {validate} from '../../utils';
import Button from '../../components/Button/Button';

export default function Cart(props){
    let [cartData, setCartData] = useState([]);
    let [message, setMessage] = useState('');
    useEffect(() => {
        const fetchData = async() => {
            let response = await axios.get('http://localhost:8081/cart', {
                headers: {
                    'Authorization': 'Bearer '+ props.token
                }
            });
            console.log(response.data.cart);
            if(validate(response) && response.status === 200)
                setCartData(response.data);            
        }
        fetchData();
    }, []);

    const removeHandler = async(id) => {
        let response = await axios.delete(`http://localhost:8081/cart?id=${id}`, {
            headers: {
                Authorization: 'Bearer '+props.token
            }
        });
        if(response.status === 200 || response.status === 201)
            setMessage(response.data.message);
    }

    return(
        <div className="cart">
            <table className="cart-table">
                <thead>
                    <tr>
                    {["Logo", "Product Id", "Quantity", "Price Per Unit", "Total", "Action"].map(element => <th>{element}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {validate(cartData.cart) ? cartData.cart.map(datum => (
                        <>
                        <tr key={datum._id}>
                            <td>
                                <img src={`http://localhost:8081/${datum.image}`} alt="im-cart"/>
                            </td>
                            <td>{datum.productId}</td>
                            <td>{datum.quantity}</td>
                            <td>${datum.price}</td>
                            <td>${(datum.quantity * datum.price)}</td>
                            <td>
                                <Button 
                                    title="Remove Item"
                                    id={datum._id}
                                    className=""
                                    clickHandler={() => removeHandler(datum._id)}
                                />
                            </td>
                        </tr>
                        </>
                    )): <p>Please add item in cart</p>
                    }
                        <tr>
                            <td colSpan="5" className="label-amount">Amount to pay</td>
                            <td>$100</td>
                        </tr>
                </tbody>
            </table>
            {message && <div>{message}</div>}
        </div>
    )
}