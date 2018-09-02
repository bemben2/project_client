import React, { Component } from 'react';
import { Glyphicon, Tabs, Tab } from 'react-bootstrap';
//import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import QuizTable from '../tables/QuizTable';
import QuestionTable from '../tables/QuestionTable';
import AnswerTable from '../tables/AnswerTable';
import MasterResultsTab from '../tabs/MasterResultsTab';
import MasterResultTable from '../tables/MasterResultsTable'
class QuizMasterNav extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userId: this.props.userId,
			token: this.props.token,
			displayQuizTable: true,
			displayQuestionTable: false,
			displayAnswerTable: false,
			displayResultsTable: false,
			questionRow: null,
			quizRow: null,
			quizForResultsTable: null
		};
	}

	showTable = (row, tableName) => {
		// console.log("showTable tableName --- " + tableName);
		// console.log("showTable row --- " + row);
		// console.log(row);

		this.setState({
			quizRow: tableName === "question" ? row : this.state.quizRow,
			questionRow: tableName === "answer" ? row : this.state.questionRow,
			displayQuizTable: tableName === "quiz",
			displayQuestionTable: tableName === "question",
			displayAnswerTable: tableName === "answer",

		});
	}
	renderResultsHandle = (key) => {
		//console.log("hey" + key);
		if (key === 2)
			this.setState((prevState) => {
				return { renderResults: !prevState.renderResults }
			})
	}
	showResultsTable = (row, tableName) => {
		console.log("showResults Table tableName --- " + tableName);
		console.log("showTable row --- " + row);
		console.log(row);
		this.setState({
			quizForResultsTable: row,
			displayResultsTable: true,
		})
	}
	showQuizTableForResults = () => {
		console.log("showQuizTableForResults");
		this.setState({
			displayResultsTable: false,
		})
	}
	render() {
		return (
			<React.Fragment>
				<Tabs bsStyle="tabs" defaultActiveKey={1} id="naviTab" onSelect={this.renderResultsHandle}>
					<Tab eventKey={1} title={<Glyphicon glyph='question-sign'> Quiz Creator</Glyphicon>}>
						{this.state.displayQuizTable && <QuizTable token={this.props.token} userId={this.props.userId} onClick={this.showTable} ></QuizTable>}
						{this.state.displayQuestionTable && <QuestionTable row={this.state.quizRow} token={this.props.token} userId={this.props.userId} onClick={this.showTable} ></QuestionTable>}
						{this.state.displayAnswerTable && <AnswerTable quizRow={this.state.quizRow} questionRow={this.state.questionRow} token={this.props.token} onClick={this.showTable} ></AnswerTable>}

					</Tab>
					<Tab eventKey={2} title={<Glyphicon glyph='info-sign'> Results</Glyphicon>} onSelect={this.renderResultsHandle}>
						{!this.state.displayResultsTable ?
							<MasterResultsTab
								token={this.state.token}
								userId={this.state.userId}
								renderResults={this.state.renderResults}
								onClick={this.showResultsTable}
							></MasterResultsTab>
							:
							<MasterResultTable
								onClick={this.showQuizTableForResults}
								token={this.state.token}
								quiz={this.state.quizForResultsTable}
							></MasterResultTable>
						}
					</Tab>
				</Tabs>
			</React.Fragment>
		);
	}
}

export default QuizMasterNav;
