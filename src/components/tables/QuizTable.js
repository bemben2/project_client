import React, { Component } from 'react';
import { Button, Panel } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class QuizTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableData: null,
		};
	}

	componentDidMount() {
		this.getFetch();
	}

	quizDurationValidator = (value, row) => {
		console.log("validate");
		const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
		const nan = isNaN(parseInt(value, 10));
		if (nan) {
			response.isValid = false;
			response.notification.type = 'error';
			response.notification.msg = 'Quiz duration must be a number!';
			response.notification.title = 'Incorrect value';
			//return 'Quiz duration must be a number!';
		}
		if (value < 5 || value > 180) {
			response.isValid = false;
			response.notification.type = 'error';
			response.notification.msg = 'Quiz duration must be in 5 to 180 minutes range! ';
			response.notification.title = 'Incorrect value';
			//return 'Quiz duration must be in 5 to 180 minutes range!';
		}
		return response;
	}

	quizNameAndCategoryValidator = (value, row) => {
		const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
		if (!value) {
			response.isValid = false;
			response.notification.type = 'error';
			response.notification.msg = 'Value must be inserted';
			response.notification.title = 'Requested Value';
		}
		return response;
	}

	handleDeletedRow = (qizzId) => {
		this.deleteFetchQuiz(qizzId);
	}

	render() {
		const cellEditProp = {
			mode: 'click',
			blurToSave: true,
			beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
			afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
		}

		const tableOptions = {
			afterInsertRow: this.handleInsertedRow,
			afterDeleteRow: this.handleDeletedRow,
		}

		const selectRow = {
			mode: 'radio',
			clickToSelect: true
		}

		return (
			<React.Fragment>
				<Panel>
					<Panel.Heading>
						List of created by you quizzies<br></br>
					</Panel.Heading>
				<Panel.Body>

				< BootstrapTable
					data={this.state.tableData}
					cellEdit={cellEditProp}
					selectRow={selectRow}
					options={tableOptions}
					hover pagination insertRow deleteRow>
					<TableHeaderColumn dataField='id'
						isKey
						autoValue={true}
						editable={false}
					>Quiz ID</TableHeaderColumn>
					<TableHeaderColumn dataField='name'
						editable={{ validator: this.quizNameAndCategoryValidator }}
					>Quiz Name</TableHeaderColumn>
					<TableHeaderColumn dataField='category'
						editable={{ validator: this.quizNameAndCategoryValidator }}
					>Category</TableHeaderColumn>
					<TableHeaderColumn dataField='duration'
						editable={{ validator: this.quizDurationValidator }}
					>Duration</TableHeaderColumn>
					<TableHeaderColumn dataField='level'
						editable={{ type: 'select', options: { values: ['beginner', 'intermediate', 'professional'] } }}
					>Level</TableHeaderColumn>
					<TableHeaderColumn dataField='active'
						editable={{ type: 'select', options: { values: ['false', 'true'] } }}
					>Active</TableHeaderColumn>
					<TableHeaderColumn dataField='button'
						hiddenOnInsert
						editable={false}
						dataFormat={this.manageTableButton}
					>Manage Questions</TableHeaderColumn>
				</BootstrapTable >
				</Panel.Body>
				</Panel>
			</React.Fragment>
		);
	}

	manageTableButton = (cell, row) => {
		return (
			<Button
				onClick={() => this.props.onClick(row, 'question')}
			>Manage Quesions</Button>
		);
	}

	onAfterSaveCell = (row, cellName, cellValue) => {
		let data = `{
			"id": ${row.id},
			"authorId": ${this.props.userId},
			"name": "${row.name}",
			"active" : ${row.active},
			"category" : "${row.category}",
			"duration": ${row.duration},
			"level": "${row.level}"
		}`;
		this.putFetch(data, row.id);
	}

	putFetch = (data, id) => {
		var url = `http://localhost:3000/api/quizzes/${id}`;

		fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this.props.token
			},
			body: data
		})
			.then(res => res.json())
			.then(json => {
				console.log(json);
				this.getFetch();
			});
	}

	getFetch = () => {
		var url = "http://localhost:3000/api/quizzes";

		fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this.props.token
			}
		})
			.then(res => res.json())
			.then(json => {
				json = json.filter(({ authorId }) => authorId === this.props.userId);
				this.setState({ tableData: json });
			});
	}

	handleInsertedRow = (row) => {
		let data = `{
			"authorId": ${this.props.userId},
			"name": "${row.name}",
			"active" : ${row.active},
			"category" : "${row.category}",
			"duration": ${row.duration},
			"level": "${row.level}"
		}`;
		this.postFetch(data);
	}

	postFetch = (data) => {
		var url = "http://localhost:3000/api/quizzes";
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this.props.token
			},
			body: data
		})
			.then(res => res.json())
			.then(json => {
				this.setState(prevState => ({
					tableData: [...prevState.tableData, json]
				}))
			});
	}
	handleDeletedRow = (rowId) => {
		this.deleteFetchQuiz(rowId);
	}

	deleteFetchQuiz = (data) => {
		var url = `http://localhost:3000/api/quizzes/${data}`;
		fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + this.props.token
			}
		})
			.then(res => res.json())
			.then(json => {
				this.getFetch();
			});
	}

}

export default QuizTable;
