import React, { Component } from 'react';
import { Panel, Badge } from 'react-bootstrap';
import Question from './Question';
import Answers from './Answers';

class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            token: this.props.token,
            quiz: this.props.quiz,
            questions: [],
            currQ: null,
            answers: [],
            indexQ: 0,
            author: [],
            result: [
                { userId: this.props.userId },
                { quizId: this.props.quiz.id },
                { finishedAt: "" },
                { answers: [] }
            ]

        });
    }

    updateResult = (newAnswer) => {
        //console.log(newAnswer);
        var result = this.state.result;
        // result.answers=newAnswer;
        result[3].answers = result[3].answers.concat(newAnswer);
        this.setState({
            result: result
        });
        console.log(this.state.result);
        this.nextQuestionHandle();
    }

    increamentIndex = () => {
        this.setState(prevState => {
            return {
                indexQ: prevState.indexQ + 1
            }
        }, () => {
          //  console.log("index" + this.state.indexQ);
            this.setState(prevState => {
                return {
                    currQ: prevState.questions[this.state.indexQ]
                }
            })
        }
        )
    }

    nextQuestionHandle = () => {
        //console.log("nextQuestionHandle " + this.state.indexQ + " " + this.state.questions.length);
        if (this.state.indexQ < this.state.questions.length - 1) {
            this.increamentIndex();
            //console.log("44 index" + this.state.currQ.id);

        } else {
            this.quizFinishedHandle();
        }
    }

    quizFinishedHandle = () => {
        console.log("Quzz DONE");
    }
    displayAnswertoPanel = (currQ) => {
        return (
            <Answers
                questionId={currQ.id}
                token={this.state.token}
                questionsLength={this.state.questions.length - 1}
                indexQ={this.state.indexQ}
                updateResult={this.updateResult}
            ></Answers>
        );
    }
    render() {
        //console.log(this.state.currQ);
        return (
            <React.Fragment>
                <Panel>
                    <Panel.Body>
                        Quiz <Badge>{this.state.quiz.name}</Badge><br></br>
                        Select correct answers and press <Badge>Next Question</Badge>
                    </Panel.Body>
                    <Panel.Footer>
                        Time: {this.state.quiz.duration} minutes. Number question: {this.state.questions.length}/{(this.state.indexQ + 1)}
                    </Panel.Footer>
                </Panel>
                <Panel>
                    <Panel.Body>
                        {this.state.currQ ? <Question title={this.state.currQ.title} body={this.state.currQ.body}></Question> : "Loading..."}
                       
                        {this.state.currQ && (this.state.currQ.id) ? <Answers 
                            questionId={this.state.currQ.id}
                            token={this.state.token}
                            questionsLength={this.state.questions.length - 1}
                            indexQ={this.state.indexQ}
                            updateResult={this.updateResult}
                        ></Answers> : "Loading..."}


                    </Panel.Body>
                    {/* <Panel.Footer>
                        <Button bsStyle="success" bsSize="small" onClick={this.nextQuestionHandle}>
                            {this.state.questions.length - 1 > this.state.indexQ ? "Next Question" : "Finish Quiz"}
                        </Button>
                    </Panel.Footer> */}
                </Panel>
            </React.Fragment>
        );
    }
    componentDidMount() {
        this.getFetchQuestions();
        //console.log(this.state.currQuestion);
    }
    getFetchQuestions = () => {
        var url = `http://localhost:3000/api/questions/quiz/${this.state.quiz.id}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(json => {
                //console.log(json);
                this.setState({
                    questions: json,
                })
                this.setState({
                    currQ: json[0],
                })
                //  console.log(this.state.questions[0]);
                

            });
    }


}

export default Quiz;
