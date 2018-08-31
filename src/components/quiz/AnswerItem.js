import React, { Component } from 'react';
import { Form } from 'react-bootstrap';

class AnswersItem extends Component {

    render() {

        return (
            <React.Fragment>
                <FormGroup controlId="loginInput" validationState={this.getValidation()}>
                    <Checkbox inline name="masterIn" onChange={this.handleChange}>{this.props.content}</Checkbox>
                   
                </FormGroup>


            </React.Fragment>
        );
    }
}

export default AnswersItem;
