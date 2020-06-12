import React from 'react';

import './Orders.css';

export default function Orders(props){
    return(
        <div className="orders">
            <table>
                <thead>
                    <tr>
                    {["id", "date of purchase", "date of arrival", "sender address", "total price paid", "invoice"]
                        .map(head => <th>{head}</th>)
                    }    
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>30 May 2020</td>
                        <td>1 June 2020</td>
                        <td>hyderabad</td>
                        <td>$100</td>
                        <td><a href="#">Invoice</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}