import React, { Component } from 'react';
import QuizPanel from './QuizPanel'
import Quiz from '../quiz/Quiz'

class QuizTab extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            token: this.props.token,
            userId: this.props.userId,
            quizzes: [],
            takeQuiz: false,
            quizToTake: null,
                      
        });
    }
    componentDidMount() {
        this.getFetch();
    }

    takeQuizzHandle = quiz => {
        // console.log("takeQuizzHandle ");
        // console.log (quiz);
        this.setState({
            quizToTake: quiz,
            takeQuiz: true,
        });

    }

    quizzesToQuizPanel = (quiz) => {
        
        const key = quiz.id;
        return <QuizPanel
            key={key}
            token={this.state.token} 
            quiz={quiz}
            onClick={this.takeQuizzHandle}
        ></QuizPanel>
    }

    render() {
        return (
            <React.Fragment>
                {!this.state.takeQuiz && (this.state.quizzes ? this.state.quizzes.map(this.quizzesToQuizPanel) : 'Loading...')}
                {this.state.takeQuiz && <Quiz quiz={this.state.quizToTake} token={this.state.token} userId={this.state.userId}></Quiz>}
            </React.Fragment>
        );
    }

    getFetch = () => {
        var url = "http://localhost:3000/api/quizzes";

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(json => {
                json = json.filter(({ active }) => active);
                this.setState({ quizzes: json });
               // console.log(this.state.quizzes);
            });
    }
}

export default QuizTab;
