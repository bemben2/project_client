import React, { Component } from 'react';
import { Button, Panel, Badge } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class AnswerTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData: null,
            question: this.props.questionRow,
            quiz: this.props.quizRow
        };
    }

    componentDidMount() {
        //console.log(this.state.quiz);
        this.getFetch();
    }

    answerContentValidator = (value, row) => {
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
                    <Panel.Body>
                        Quiz <Badge>{this.state.quiz.name}</Badge><br></br>
                        Question <Badge>{this.state.question.body}</Badge> - <Badge>{this.state.question.body}</Badge><br></br>
                        Create answers for this question<br></br>
                    </Panel.Body>
                </Panel>
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
                    >Answer ID</TableHeaderColumn>

                    <TableHeaderColumn dataField='content'
                        editable={{ type: 'textarea', validator: this.answerContentValidator }}
                    >Content</TableHeaderColumn>

                    <TableHeaderColumn dataField='result'
                        editable={{ type: 'select', options: { values: ['false', 'true'] } }}
                    >Result</TableHeaderColumn>

                </BootstrapTable>
                <Button onClick={() => this.props.onClick(this.state.quiz, "question")}>Back to Question</Button>
            </React.Fragment>
        );
    }

    onAfterSaveCell = (row, cellName, cellValue) => {
        console.log("row.id" + row.id);

        let data = `{
			"id": ${row.id},
			"questionId": ${this.state.question.id},
			"content": "${row.content}",
			"result" : ${row.result}
        }`;
        this.putFetch(data, row.id);
    }

    putFetch = (data, id) => {
        var url = `http://localhost:3000/api/answers/${id}`;
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
			"questionId": ${this.state.question.id},
			"content": "${row.content}",
			"result" : ${row.result}
        }`;
        this.postFetch(data);
    }

    postFetch = (data) => {
        var url = "http://localhost:3000/api/answers";
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
        var url = `http://localhost:3000/api/answers/question/${this.state.question.id}`;

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
        var url = `http://localhost:3000/api/answers/${data}`;
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

export default AnswerTable;
