import React, { Component } from 'react';
import { Button, Navbar, Nav, NavItem } from 'react-bootstrap';

class BannerWithSignUp extends Component {
    render() {
        return (
            <header>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#home">Welcome in ONLINE QUIZZIES </a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav pullRight>
                        <NavItem eventKey={1} href="#">
                            <Button bsSize="small"  onClick={this.props.onClick}>SignUp</Button>
                        </NavItem>
                        <NavItem eventKey={2} href="#">

                        </NavItem>
                    </Nav>
                </Navbar>
            </header>
        );
    }
}

export default BannerWithSignUp;
