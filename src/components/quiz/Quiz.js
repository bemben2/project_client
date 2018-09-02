import React, { Component } from 'react';
import { Panel, Badge, Button, ProgressBar } from 'react-bootstrap';
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
            isQuizDone: false,
            perCentResult: 0,
            timeToEnd: this.props.quiz.duration * 60,
            interval: null,
            result: [
                { userId: this.props.userId },
                { quizId: this.props.quiz.id },
                { finishedAt: "" },
                { answers: [] },
                { questionNo: 0},
                { userName: ''}
            ]

        });
    }
    calcTimeFromStart = () => {

       // console.log(this.state.timeToEnd);
        if (this.state.timeToEnd <= 0) {
//console.log("End Time");
            window.clearInterval(this.state.interval);
            this.quizFinishedHandle();
        } else {
            this.setState((prevState) => {
                return { timeToEnd: (prevState.timeToEnd - 1) }
            })
        }
    }
    componentWillUnmount () {
        window.clearInterval(this.state.interval);
    }
    startCountdown = () => {
        var interval = window.setInterval(this.calcTimeFromStart, 1000);
        this.setState({
            interval: interval
        })
    }

    updateResult = (newAnswer) => {
        var result = this.state.result;
        result[3].answers = result[3].answers.concat(newAnswer);
        this.setState({
            result: result
        });
        this.nextQuestionHandle();
    }

    increamentIndex = () => {
        this.setState(prevState => {
            return {
                indexQ: prevState.indexQ + 1
            }
        }, () => {
            this.setState(prevState => {
                return {
                    currQ: prevState.questions[this.state.indexQ]
                }
            })
        })
    }

    nextQuestionHandle = () => {
        if (this.state.indexQ < this.state.questions.length - 1) {
            this.increamentIndex();
        } else {
            this.quizFinishedHandle();
        }
    }

    quizFinishedHandle = () => {
        var result = this.state.result;
        result[2].finishedAt = `${new Date()}`;
        result[4].questionNo = this.state.questions.length;
        this.setState({
            result: result
        })
        this.postQuizResults(JSON.stringify(result));
        this.setState({
            isQuizDone: true,
        })
        this.setState((prevState) => {
            return { timeToEnd: (prevState.timeToEnd - 1) }
        })
        this.claculatePerCentResult();
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

    claculatePerCentResult = () => {
        var noQuestion = this.state.questions.length;
        var noCorrect = 0;
        var result = this.state.result;
        result[3].answers.forEach(element => {
            if (element.correct) {
                noCorrect++;
            }
        });
        var perCentResult = noCorrect * 100 / noQuestion;
        perCentResult = Number.parseFloat(perCentResult).toPrecision(4);
        this.setState({
            perCentResult: perCentResult
        })

    }

    render() {
        //console.log("nowCalc" + ((this.state.indexQ + 1) * 100 / this.state.questions.length));
        return (
            <React.Fragment>
                <Panel>
                    <Panel.Body>
                        Quiz <Badge>{this.state.quiz.name}</Badge><br></br>
                        {!this.state.isQuizDone ? <React.Fragment>Select correct answers and press <Badge>Next Question</Badge> </React.Fragment> : null}
                    </Panel.Body>

                    {/* {!this.state.isQuizDone ? <Panel.Footer>Time: {this.state.quiz.duration} minutes. </Panel.Footer> : null} */}
                    {!this.state.isQuizDone ?
                        <Panel.Footer>
                            <ProgressBar now={(this.state.indexQ + 1) * 100 / this.state.questions.length} label={`${(this.state.indexQ + 1)} of ${this.state.questions.length} questions`} />
                            <ProgressBar now={((this.state.quiz.duration * 60) - (this.state.timeToEnd)) * 100 / (this.state.quiz.duration * 60)} label={`${Math.floor(this.state.timeToEnd / 60)} of ${this.state.quiz.duration} minutes`} bsStyle="success" active />
                        </Panel.Footer>
                        : null}

                </Panel>
                <Panel>
                    <Panel.Body>
                        {!this.state.isQuizDone && this.state.currQ ? <Question title={this.state.currQ.title} body={this.state.currQ.body}></Question> : null}

                        {!this.state.isQuizDone && this.state.currQ && this.state.currQ.id ? <Answers
                            questionId={this.state.currQ.id}
                            token={this.state.token}
                            questionsLength={this.state.questions.length - 1}
                            indexQ={this.state.indexQ}
                            updateResult={this.updateResult}
                        ></Answers> : null}
                        {this.state.isQuizDone ?
                            <React.Fragment>
                                <Panel>
                                    <Panel.Heading>
                                        You finished the quiz
                                    </Panel.Heading>
                                    <Panel.Body>
                                        Your result is {this.state.perCentResult} Congratulation !!!
                                    </Panel.Body>
                                    <Panel.Footer>
                                        <Button bsStyle="primary" onClick={this.props.showQuizzes}>Back To Quizzes</Button>
                                    </Panel.Footer>
                                </Panel>
                            </React.Fragment> : null}
                        {/* {this.state.isQuizDone ? <UserResultsTab result={this.state.result[0]} onClick={this.backToQuizzesHandle}></UserResultsTab> : null} */}
                    </Panel.Body>
                </Panel>
            </React.Fragment>
        );
    }

    postQuizResults = (data) => {
        var url = `http://localhost:3000/api/results/check`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            },
            body: data
        })
            .then(res => res.json())
            .then(json => {
            });
    }

    componentDidMount() {
        this.getFetchQuestions();
        this.startCountdown();
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
