import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';

import { required, length } from '../../util/validators';
import Button from '../../components/Button/Button';
import Input from '../../components/Form/Input/Input';
import './style.css';

const initializeForm = {
    username: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })],
        error: ''
    },
    password: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })],
        error: ''
    },
    confirmPassword: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })],
        error: ''
    },
    formIsValid: false
};

class Signup extends Component {
    state = {
        form: { ...initializeForm },
        responseMessage: ""
    }

    inputChangeHandler = (input, value) => {
        value = value.trim();
        this.setState(prevState => {
            let isValid = true;
            for(const validator of prevState.form[input].validators){
                isValid = isValid && validator(value);
            }
            const updatedForm = {
                ...prevState.form,
                [input]: {
                    ...prevState.form[input],
                    valid: isValid,
                    value: value,
                    error: ''
                }
            };
            let formIsValid = true;
            for(const inputName in updatedForm){
                formIsValid = formIsValid && updatedForm[inputName].valid;
            }
            return{
                form: updatedForm,
                formIsValid: formIsValid
            };
        });
    };

    inputBlurHandler = input => {
        this.setState(prevState => {
            return{
                    form: {
                    ...prevState.form,
                    [input]: {
                        ...prevState.form[input],
                        touched: true
                    }    
                }
            };
        });
    };

    clear = () => {
        this.setState({ form: { ...initializeForm } });
    }

    arePasswordsSame = () => {
        if(this.state.form.password.value === this.state.form.confirmPassword.value)
            return true;
        return false;
    }

    save = (event) => {
        event.preventDefault();

        let { form } = this.state;
        let isError = false;
        if(form.username.value === ""){
            isError = true;
            form.username.error = 'username cannot be empty'
        }
        if(form.password.value === ""){
            isError = true;
            form.password.error = 'password cannot be empty'
        }
        if(form.confirmPassword.value === ""){
            isError = true;
            form.confirmPassword.error = 'confirm Password cannot be empty'
        }
        if(isError){
            this.setState({ form });
            return;
        }
        if(!this.arePasswordsSame()){
            this.setState({ responseMessage: "please check passwords are same" });
            return;
        }

        fetch('http://localhost:8081/signup', {
            // mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type':'application/x-www-form-urlencoded'
            },
            body: queryString.stringify({
                username: this.state.form.username.value,
                password: this.state.form.password.value
            })             
        })
        .then(res => {
            console.log(res)
            if(res.status === 422){
                // this.setState({ responseMessage: "Validation failed. Make sure the username isn't used yet!"});
               this.setState({ responseMessage: "Validation failed." });                
               throw new Error("Validation failed.");
            }
            if(res.status !== 200 && res.status !== 201){
                console.log('Error!');
                this.setState({ responseMessage: "Creating a user failed!" });
                throw new Error('Creating a user failed!');
            }
            return res.json();
        })
        .then(resData => {
            // console.log(resData);
            this.setState({responseMessage: resData.message });           
            this.clear();
        })
        .catch(err => {
            console.log(err);
        })
    }

    render(){
        return(
            <div className="signup-form">
                <form>
                    <Input 
                        id="username"
                        label="Your Username"
                        type="text" 
                        control="input"
                        value={this.state.form['username'].value} 
                        onChange={this.inputChangeHandler}
                        onBlur={this.inputBlurHandler.bind(this, 'username')}
                        valid={this.state.form['username'].valid}
                        touched={this.state.form['username'].touched}
                    />
                    <br/>
                    {this.state.form.username.error &&
                        <span className="error">{this.state.form.username.error}</span>
                    }
                    <Input 
                        id="password"
                        label="Password"
                        type="password"
                        control="input"
                        onChange={this.inputChangeHandler}
                        onBlur={this.inputBlurHandler.bind(this, 'password')}
                        value={this.state.form['password'].value}
                        valid={this.state.form['password'].valid}
                        touched={this.state.form['password'].touched}
                    />
                    <br/>
                    {this.state.form.password.error &&
                        <span className="error">{this.state.form.password.error}</span>
                    }
                    <Input 
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        control="input"
                        onChange={this.inputChangeHandler}
                        onBlur={this.inputBlurHandler.bind(this, 'confirmPassword')}
                        value={this.state.form['confirmPassword'].value}
                        valid={this.state.form['confirmPassword'].valid}
                        touched={this.state.form['confirmPassword'].touched}
                    />
                    <br/>
                    {this.state.form.confirmPassword.error &&
                        <span className="error">{this.state.form.confirmPassword.error}</span>
                    }
                </form>
                <div className="btns">
                    <Button title="Clear" clickHandler={() => this.clear()} />
                    <Button title="Signup" clickHandler={event => this.save(event)} />
                </div>
                <div>
                {this.state.responseMessage &&
                    <span className="error">{this.state.responseMessage}</span>
                }
                </div>
            </div>
        )
    }
}

export default Signup;