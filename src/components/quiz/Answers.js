import React, { Component } from 'react';
import _ from 'lodash';
import { Panel, Button, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

class Answers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: [],
            allValues: [],
            index: 0,
        };
    }

    handleChange = (event) => {
        // console.log("handleChange");
        // console.log(event);
        this.setState({
            values: event
        }, () => {
            //console.log("this.state.values");
            //console.log(this.state.values);
        });
    }
    arrayContainsArray(superset, subset) {
        if (0 === subset.length) {
            return false;
        }
        return subset.every(function (value) {
            return (superset.indexOf(value) >= 0);
        });
    }
    getCorrectResults = () => {
        var corrResults = [];
        this.state.answers.forEach(answer => {
            if (answer.result) {
                corrResults.push(answer.id);
            }
        });
        return corrResults;
    }
    nextQuestionHandle = () => {
        var corrResults = this.getCorrectResults();
        var index = this.state.index;
        var allValues = this.state.allValues;
        allValues[index] = this.state.values;

        var lastAnswers = this.state.values;

        // console.log("allValues[index] index = " + index);
        // console.log(allValues);

        if (allValues.length > 1 && index < allValues.length) {
            //console.log("slice " + index);
            lastAnswers=_.slice(lastAnswers, allValues[index - 1].length, lastAnswers.length);
        } else {
            lastAnswers = allValues[index];
        }

        // console.log("lastAnswers");
        // console.log(lastAnswers);
        // console.log("corrResults");
        // console.log(corrResults);
        // var correct = this.arrayContainsArray(lastAnswers,corrResults );
        var correct = _.isEmpty(_.xor(corrResults, lastAnswers))
        var answer = {
            questionId: this.props.questionId,
            correct: correct
        };
        //console.log(answer);
        this.props.updateResult(answer);
        this.setState({
            index: this.state.index + 1
        })


    }

    answersToCheckbox = (answer) => {
        return (
            <ToggleButton key={answer.id} value={answer.id}> {answer.content}</ToggleButton>
        );
    }

    render() {
        return (
            <React.Fragment>
                <Panel>
                    <Panel.Body>
                        <ToggleButtonGroup vertical block
                            type="checkbox"

                            onChange={this.handleChange}
                        >
                            {this.state.answers ? this.state.answers.map(this.answersToCheckbox) : "Loading..."}
                        </ToggleButtonGroup>
                    </Panel.Body>
                    <Panel.Footer>
                        <Button bsStyle="primary" bsSize="small" onClick={this.nextQuestionHandle}>
                            {this.props.questionsLength > this.props.indexQ ? "Next Question" : "Finish Quiz"}
                        </Button>
                    </Panel.Footer>
                </Panel>
            </React.Fragment>
        );
    }
    componentDidUpdate(prevProps) {
        if (this.props.questionId !== prevProps.questionId) {
            var arr = [];
            this.setState(prevState => {
                return {
                    values: []
                }
            }, () => {
                //console.log("componentDidUpdate");
            });
            this.handleChange([arr]);
            this.getFetch();
        }
    }
    componentDidMount() {
        this.getFetch();
    }

    getFetch = () => {
        var url = `http://localhost:3000/api/answers/question/${this.props.questionId}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.token
            }
        })
            .then(res => res.json())
            .then(json => {
                this.setState({
                    answers: json,
                })
            });
    }
}

export default Answers;
