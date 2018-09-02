import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isValid: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {

        var data = `{
            "email": "${this.state.email}",
            "password": "${this.state.password}"
            }`;

        var url = "http://localhost:3000/api/auth/signin";
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
            .then(res => res.json())
            .then(response => {
                //console.log(response);
                if (response === 'no user with this login' || response === "wrong password") {
                    this.setState({ isValid: false });
                } else {
                    this.props.assignUser(response.id, response.name, response.email, response.token, response.master);
                }
            })
            .catch(error => console.log(error));
        event.preventDefault();
    }

    handleChange(event) {
        //console.log(event.target.id);
        if (event.target.name === "login") {
            this.setState({ email: event.target.value });
        } else if (event.target.name === "passField") {
            this.setState({ password: event.target.value });
        }
    }

    getValidation = () => {
        if (!this.state.isValid) {
            return 'error';
        } else {
            return null;
        }
        // if (length > 10) return 'success';
        // else if (length > 5) return 'warning';
        // else if (length > 0) return 'error';
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>

                <FormGroup controlId="loginInput" validationState={this.getValidation()}>
                    <ControlLabel> Email </ControlLabel>
                    <FormControl name="login" type="email" value={this.state.email} onChange={this.handleChange}></FormControl>
                    <FormControl.Feedback />
                    <HelpBlock>We'll never share your email with anyone else.</HelpBlock>
                </FormGroup>

                <FormGroup controlId="password" validationState={this.getValidation()}>
                    <ControlLabel> Password </ControlLabel>
                    <FormControl name="passField" type="password" value={this.state.password} onChange={this.handleChange}></FormControl>
                    <FormControl.Feedback />
                </FormGroup>

                <button type="submit" className="btn btn-primary">Login</button>
            </form >
        );
    }
}

export default Login;
