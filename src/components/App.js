import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import './App.css';
import SingUp from './auth/SignUp';
import Login from './auth/Login'
import BannerWithLogin from './header/BannerWithLogin';
import BannerWithLogout from './header/BannerWithLogout';
import BannerWithSignUp from './header/BannerWithSignUp';
import QuizMasterNav from './nav/QuizMasterNav';
import QuizUserNav from './nav/QuizUserNav';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userId: null,
			user: '',
			email: '',
			token: '',
			isMaster: false,
			login: true,
			signup: false
		}
	}

	render() {
		if (this.state.token === null || this.state.token === '') {
			//console.log("token nie istnieje");
			return (
				<Grid>
					<Row className="show-grid">
						<Col xs={12} md={12}>
							{this.state.signup ? <BannerWithLogin onClick={this.loginOrSingUp} /> : null}
							{this.state.login ? <BannerWithSignUp onClick={this.loginOrSingUp} /> : null}
						</Col>
					</Row>
					<Row className="show-grid">
						<Col xs={2} md={2}>
							<img src="logo.jpg" width="100" height="60" alt="Logo"></img>
						</Col>
						<Col xs={9} md={8}>
							{this.state.signup ? <SingUp assignUser={(userId, user, email, token, isMaster) => this.assignUser(userId, user, email, token, isMaster)} /> : null}
							{this.state.login ? <Login assignUser={(userId, user, email, token, isMaster) => this.assignUser(userId, user, email, token, isMaster)} /> : null}
						</Col>
						<Col xs={1} md={2}>

						</Col>
					</Row>
				</Grid>
			);
		}

		if (this.state.token !== null || this.state.token !== '' || this.state.token === 'undefined') {
			//console.log("token istnieje: " + this.state.token);
			return (
				<Grid>
					<Row className="show-grid">
						<Col xs={12} md={12}>
							<BannerWithLogout user={this.state.user} onClick={() => this.logoutHandle()} />
						</Col>
					</Row>
					<Row className="show-grid">
						<Col xs={12} md={12}>
							{this.state.isMaster ?
								<QuizMasterNav token={this.state.token} userId={this.state.userId}></QuizMasterNav>
								: <QuizUserNav
									token={this.state.token}
									userId={this.state.userId}
								></QuizUserNav>
							}
						</Col>
					</Row>
				</Grid>
			);
		}
	}


	logoutHandle() {
		console.log('LOgout klikniety');
		this.setState({
			userId: '',
			user: '',
			email: '',
			token: '',
			isMaster: false,
		});
	}

	assignUser(userId, user, email, token, isMaster) {
		this.setState({
			userId: userId,
			user: user,
			email: email,
			token: token,
			isMaster: isMaster,
		});
	}

	loginOrSingUp = () => {
		console.log('loginHandle()');
		this.setState(prevState => {
			return {
				login: !prevState.login,
				signup: !prevState.signup
			};
		});
	}
}

export default App;
