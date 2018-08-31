import React, { Component } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import QuizTab from '../tabs/QuizTab';
import UserResultsTab from '../tabs/UserResultsTab';

class QuizUserNav extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            token: this.props.token,
            userId: this.props.userId,
            quizzes: null
        });
    }
    render() {

        return (
            <React.Fragment>
                <Tabs defaultActiveKey={1} id="noanim-tab-example">
                    <Tab eventKey={1} title="Quizzies">
                        <QuizTab
                            token={this.state.token}
                            userId={this.state.userId}
                        ></QuizTab>
                    </Tab>
                    <Tab eventKey={2} title="Results">
                        <UserResultsTab></UserResultsTab>
                    </Tab>
                    <Tab eventKey={3} title="Tab 3">
                        Tab 3 content
                        </Tab>
                </Tabs>
            </React.Fragment>
        );

    }
}

export default QuizUserNav
