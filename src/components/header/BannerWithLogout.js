import React, { Component } from 'react';
import { Button, Navbar, Nav, NavItem } from 'react-bootstrap';

class BannerWithLogout extends Component {
    render() {
        return (
            <header>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#home">Welcome {this.props.user} </a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav pullRight>
                        <NavItem eventKey={1} href="#">
                            <Button bsSize="small"  onClick={this.props.onClick}>Logout</Button>
                        </NavItem>
                        <NavItem eventKey={2} href="#">

                        </NavItem>
                    </Nav>
                </Navbar>
            </header>
        );
    }
}

export default BannerWithLogout;
