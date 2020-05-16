import React, { Component } from 'react';

import './Products.css';
import Product from './Product/Product';
import axios from 'axios';

class Products extends Component{
    state = {
        products: []
    };

    async componentDidMount(){
        try{
            let response = await axios('http://localhost:8081/products');
            // console.log(response.data.products);
            this.setState({ products: response.data.products });
        }catch(error){
            console.log(error);
        }
    }

    editProduct = async(productId) => {
        this.props.history.push(`/edit-product/${productId}`)
    }

    deleteProduct = async(productId) => {
        try{
            let response = await axios.delete(`http://localhost:8081/product?id=${productId}`)
            if(response.status !== 200 && response.status !== 201){
                throw new Error("Deleting a product failed!");
            }
            this.setState(prevState => {
                const updatedProducts = prevState.products.filter(p => p._id !== productId);
                return { products: updatedProducts };
            })
        }catch(error){
            console.log(error);
        }
    }
    render(){
        return(
            <div className="products">
                {this.state.products.length > 0 && this.state.products.map(product => (
                    <Product key={product._id} product={product} 
                        deleteProduct={this.deleteProduct} editProduct={this.editProduct}
                    />
                ))}
            </div>           
        )
    }
}

export default Products;