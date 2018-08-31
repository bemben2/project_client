import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';

class Question extends Component {
    render() {

        return (
            <React.Fragment>

                <Panel>
                    <Panel.Body>
                        Title: {this.props.title}<br></br>
                        <hr></hr>
                        {this.props.body}<br></br>
                    </Panel.Body>
                </Panel>

            </React.Fragment>
        );
    }
}

export default Question;
