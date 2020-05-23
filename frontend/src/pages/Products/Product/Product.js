import React from 'react';

import './Product.css';
import Button from '../../../components/Button/Button';

const Product = props => (
    <div className="product">
        <div className="title">{props.product.title.toUpperCase()}</div>
        <div className="imageUrl">
            <img src={`http://localhost:8081/${props.product.imageUrl}`} alt="not available" />
        </div>
        <div className="description">
            {props.product.description}
        </div>
        {props.isAdmin && <div className="btn">
            <Button title="Edit" id="productEdit"  clickHandler={() => props.editProduct(props.product._id)} />
            <Button title="Delete" id="productDelete" clickHandler={() => props.deleteProduct(props.product._id)} />
        </div>
        }
    </div>
);

export default Product;