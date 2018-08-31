import React, { Component } from 'react';
import { Button, Checkbox, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "misiek",
            email: "emfffad@sdf",
            password: "dsaf",
            master: false,
            isValid: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        if (event.target.name === "nameIn") {
            this.setState({ name: event.target.value });
        } else if (event.target.name === "loginIn") {
            this.setState({ email: event.target.value });
        } else if (event.target.name === "passwordIn") {
            this.setState({ password: event.target.value });
        } else if (event.target.name === "masterIn") {
            this.setState({ master: !this.state.master });
        }
    }

    handleSubmit(event) {
        // console.log(`name: ${this.state.name} email: ${this.state.email} pass ${this.state.password},${this.state.master} `);
        var data = `{
            "name": "${this.state.name}",
            "email": "${this.state.email}",
            "password": "${this.state.password}",
            "master": ${this.state.master}
            }`;

        console.log(this.props);
        var url = "http://localhost:3000/api/auth/signup";
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
            .then(res => res.json())
            .then(response => {
                console.log(response);
                if (response === 'Validation error') {
                    this.setState({ isValid: false });
                } else {
                    var user = response;
                    console.log("user" + user.token);
                    this.props.assignUser(response.id, user.name, user.email, user.token, user.isMaster);
                }
                // assignUser(user);
                // localStorage.setItem("user", user);
                // console.log('Email =====' + user.token);
                // console.log(localStorage.getItem(user.email));
            })
            .catch(error => console.log(error));

        event.preventDefault();
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormGroup controlId="nameFG" validationState={this.getValidation()}>
                    <ControlLabel> Name </ControlLabel>
                    <FormControl name="nameIn" type="text" placeholder="your name" value={this.state.name} onChange={this.handleChange}></FormControl>
                    <FormControl.Feedback />
                </FormGroup>

                <FormGroup controlId="emailFG" validationState={this.getValidation()}>
                    <ControlLabel> Email </ControlLabel>
                    <FormControl name="loginIn" type="email" value={this.state.email} onChange={this.handleChange}></FormControl>
                    <FormControl.Feedback />
                </FormGroup>

                <FormGroup controlId="passwordFG" validationState={this.getValidation()}>
                    <ControlLabel> Password </ControlLabel>
                    <FormControl name="passwordIn" type="password" value={this.state.password} onChange={this.handleChange}></FormControl>
                    <FormControl.Feedback />
                </FormGroup>

                <FormGroup controlId="masterFG" validationState={this.getValidation()}>
                    <Checkbox inline name="masterIn" checked={this.setState.master} onChange={this.handleChange}>Quiz Master</Checkbox>
                    <FormControl.Feedback />
                </FormGroup>
                <Button bsStyle="primary" type="submit" >Sign Up</Button>
            </Form >
        );
    }

    getValidation = () => {
        if (!this.state.isValid) {
            return 'error';
        } else {
            return null;
        }
        // return 'success'; 'warning';'error';
    }
}

export default SignUp;
