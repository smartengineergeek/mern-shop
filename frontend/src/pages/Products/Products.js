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
            // console.log("products ", response.data.products);
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
            let response = await axios.delete(`http://localhost:8081/product?id=${productId}`, {
                headers: {
                    Authorization: 'Bearer ' + this.props.token
                } 
            })
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

    addToCart = async(cart) => {
//       console.log("cart ", cart);
        try{
            let response = await axios.post("http://localhost:8081/add-cart", 
            cart,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.props.token
                },
            })
            if(response.status !== 200 && response.status !== 201){
                throw new Error('Adding product to cart failed!');
            }
        }catch(error){
            console.log(error);
        }
    }

    render(){
        let displayProducts = [];
        if(this.state.products.length > 0){
            if(this.props.isAdmin){
                displayProducts = this.state.products.filter(product => product.userId === this.props.userId)
                console.log("displayProducts ", displayProducts)
            }else{
                displayProducts = [ ...this.state.products ];
            }
        }

        return(
            <div className="products">
                {displayProducts.length > 0 && displayProducts.map(product => (
                    <Product key={product._id} product={product} 
                        isAuth={this.props.isAuth}
                        isAdmin={this.props.isAdmin} 
                        deleteProduct={this.deleteProduct} editProduct={this.editProduct}
                        addToCart={this.addToCart}
                        userId={this.props.userId}
                    />
                )
                )}
            </div>           
        )
    }
}

export default Products;