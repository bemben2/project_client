import React, { Component } from 'react';
import { Tab, Tabs, Glyphicon } from 'react-bootstrap';
import QuizTab from '../tabs/QuizTab';
import UserResultsTab from '../tabs/UserResultsTab';

class QuizUserNav extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            token: this.props.token,
            userId: this.props.userId,
            quizzes: null,
            renderResults : false
        });
    }

    renderResultsHandle = (key) => {
        console.log("hey" +key);
        if(key ===2)
        this.setState((prevState)=>{
            return {renderResults: !prevState.renderResults}
        })
    }

    render() {

        return (
            <React.Fragment>
                <Tabs bsStyle="tabs" defaultActiveKey={1} id="naviTab" onSelect={this.renderResultsHandle}>
                    <Tab eventKey={1} title={<Glyphicon glyph='question-sign'> Quizzies</Glyphicon>}>
                        <QuizTab
                            token={this.state.token} userId={this.state.userId}
                        ></QuizTab>
                    </Tab>
                    <Tab eventKey={2} title={<Glyphicon glyph='info-sign'> Results</Glyphicon>} onSelect={this.renderResultsHandle}>
                        <UserResultsTab
                            token={this.state.token} userId={this.state.userId} renderResults={this.state.renderResults}
                        ></UserResultsTab>
                    </Tab>
                </Tabs>
            </React.Fragment>
        );

    }
}

export default QuizUserNav
