import React, { Component } from 'react';
import { Button, Panel, Badge } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
class QuestionTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: null,
            quiz: this.props.row
        };
    }

    componentDidMount() {
        //console.log(this.state.quiz);
        this.getFetch();
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

    render = () => {
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
                        Quiz <Badge>{this.state.quiz.name}</Badge><br></br>
                        Create questions for this quiz<br></br>
                    </Panel.Heading>
                    <Panel.Body>
                        < BootstrapTable
                            data={this.state.tableData}
                            cellEdit={cellEditProp}
                            selectRow={selectRow}
                            options={tableOptions}
                            responsive hover pagination insertRow deleteRow>
                            <TableHeaderColumn dataField='id'
                                isKey
                                autoValue={true}
                                editable={false}
                            >Quiz ID</TableHeaderColumn>
                            <TableHeaderColumn dataField='title'
                                editable={{ validator: this.quizNameAndCategoryValidator }}
                            >Title</TableHeaderColumn>
                            <TableHeaderColumn dataField='body'
                                editable={{ type: 'textarea', validator: this.quizNameAndCategoryValidator }}
                            >Body</TableHeaderColumn>
                            <TableHeaderColumn dataField='button'
                                hiddenOnInsert
                                editable={false}
                                dataFormat={this.manageAnswersnButton}
                            >Manage Answers</TableHeaderColumn>
                        </BootstrapTable >
                    </Panel.Body>
                    <Panel.Footer>
                        <Button bsStyle="primary" onClick={() => this.props.onClick("row", "quiz")}>Back to Quizzes</Button>
                    </Panel.Footer>
                </Panel>
            </React.Fragment>
        );
    }

    manageAnswersnButton = (cell, row) => {
        return (
            <Button
                onClick={() => this.props.onClick(row, "answer")}
            >Manage Answers</Button>
        );
    }

    onAfterSaveCell = (row, cellName, cellValue) => {
        console.log("row.id" + row.id);

        let data = `{
                    "id": ${row.id},
			"quizId": ${this.state.quiz.id},
			"title": "${row.title}",
			"body" : "${row.body}"
            }`;
        this.putFetchQuestion(data, row.id);
    }

    putFetchQuestion = (data, id) => {

        var url = `http://localhost:3000/api/questions/${id}`;
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

    handleInsertedRow = (row) => {
        let data = `{
                    "quizId": ${this.state.quiz.id},
			"title": "${row.title}",
			"body" : "${row.body}"
            }`;
        this.postFetchQuestion(data);
    }

    postFetchQuestion = (data) => {
        var url = "http://localhost:3000/api/questions";
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

    getFetch = () => {
        var url = `http://localhost:3000/api/questions/quiz/${this.state.quiz.id}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.token
            }
        })
            .then(res => res.json())
            .then(json => {
                //json = json.filter(({ authorId }) => authorId === this.props.userId);
                this.setState({ tableData: json });
            });
    }

    handleDeletedRow = (Id) => {
        this.deleteFetch(Id);
    }

    deleteFetch = (data) => {
        var url = `http://localhost:3000/api/questions/${data}`;
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

export default QuestionTable;
