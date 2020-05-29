import React, { useState } from 'react';

import './Product.css';
import Button from '../../../components/Button/Button';


export default function Product(props){
    let [quantity, setQuantity] = useState(1);
    const selectHandler = event => {
        setQuantity(+(event.target.value));
    }
    return(
        <div className="product">
            {/* <div>Creator {props.product.creator} </div> */}
            <div className="imageUrl">
                <img src={`http://localhost:8081/${props.product.imageUrl}`} alt="not available" />
            </div>
            <div className="title">
                <span>{props.product.title.toUpperCase()}</span>
                <span>Price:${props.product.price}</span>
            </div>
            <div className="description">
                {props.product.description}
            </div>
            {props.isAuth && <div className="quantity">
                <span>Select quantity:</span>&nbsp;
                <select value={quantity} onChange={event => selectHandler(event)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
            </div>}
            <div className="btn">
            {props.isAdmin ? 
            <>
                <Button title="Edit" id="productEdit"  
                    clickHandler={() => props.editProduct(props.product._id)} 
                />
                <Button title="Delete" id="productDelete" 
                    clickHandler={() => props.deleteProduct(props.product._id)} 
                />
            </>:
            <>
            {props.isAuth ? <>
                <Button title="Add To Cart" id="productAddToCart"  
                    clickHandler={() => props.addToCart({ 
                        productId: props.product._id, 
                        price: props.product.price,
                        imageUrl: props.product.imageUrl,
                        quantity: quantity 
                    })} 
                />
                <Button title="Buy Now" id="productBuyNow"  
                    clickHandler={() => props.buyNowProduct(props.product._id)} 
                />
            </>: null }
            </>}
            </div>
        </div>
        )
}

