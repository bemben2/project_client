import React, { Component } from 'react';
//import { Button } from 'react-bootstrap';
//import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import QuizTable from '../tables/QuizTable';
import QuestionTable from '../tables/QuestionTable';
import AnswerTable from '../tables/AnswerTable';

class QuizMasterNav extends Component {
	constructor(props) {
		super(props);
		this.state = {
			displayQuizTable: true,
			displayQuestionTable: false,
			displayAnswerTable: false,
			questionRow: null,
			quizRow: null
		};
	}

	showTable = (row, tableName) => {
		console.log("showTable tableName --- "+tableName);
		console.log("showTable row --- "+row);
		console.log(row);

		this.setState({
			quizRow: tableName === "question" ? row : this.state.quizRow,
			questionRow :tableName === "answer" ? row : this.state.questionRow,
			displayQuizTable: tableName === "quiz" ,
			displayQuestionTable: tableName === "question" ,
			displayAnswerTable: tableName === "answer",
			
		});
	}

	render() {
		return (
			<React.Fragment>
				{this.state.displayQuizTable && <QuizTable token={this.props.token} userId={this.props.userId} onClick={this.showTable} ></QuizTable>}
				{this.state.displayQuestionTable && <QuestionTable row={this.state.quizRow} token={this.props.token} userId={this.props.userId} onClick={this.showTable} ></QuestionTable>}
				{this.state.displayAnswerTable && <AnswerTable quizRow={this.state.quizRow} questionRow={this.state.questionRow} token={this.props.token} onClick={this.showTable} ></AnswerTable>}
			</React.Fragment>
		);
	}
}

export default QuizMasterNav;
