import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import dateformat from 'dateformat';

class UserResultsTab extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            tableData: null,
            quizzes: null,
            results: null
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.renderResults !== prevProps.renderResults) {
            this.getFetch();
        }
    }

    render() {
        const selectRow = {
            clickToSelect: true
        }

        return (
            <React.Fragment>
                <Panel>
                    <Panel.Heading>
                        You finished the quiz
                    </Panel.Heading>
                    <Panel.Body>
                        <React.Fragment>
                            <Panel>
                                <Panel.Body>
                                    List of results
                                </Panel.Body>
                            </Panel>

                            < BootstrapTable
                                data={this.state.tableData}
                                selectRow={selectRow}
                                hover pagination>
                                <TableHeaderColumn dataField='quizId' >Quiz Name</TableHeaderColumn>
                                <TableHeaderColumn isKey dataField='finishedAt' dataFormat={this.dateFormatter}>Finished At</TableHeaderColumn>
                                <TableHeaderColumn dataField='questionNo'>Questions No.</TableHeaderColumn>
                                <TableHeaderColumn dataField='answers' dataFormat={this.answersFormatter}>Results</TableHeaderColumn>

                            </BootstrapTable >
                        </React.Fragment>
                    </Panel.Body>
                </Panel>
            </React.Fragment>
        );
    }
    answersFormatter = (cell, row) => {
        var noQuestion = row.questionNo;
        let noCorrect = 0;
        cell.forEach(element => {
            if (element.correct === "true") {
                noCorrect++;
            }
        });

        var perCentResult = noCorrect * 100 / noQuestion;
        perCentResult = Number.parseFloat(perCentResult).toPrecision(4);
        return perCentResult
    }


    dateFormatter = (cell, row) => {
        var d = new Date(cell);
        d = dateformat(d, "ddd, yyyy mmm dd, h:MM tt");
        return d;
    }

    componentDidMount() {
        this.getFetch();
    }

    getFetch = () => {
        var url = `http://localhost:3000/api/results/user/${this.props.userId}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.token
            }
        })
            .then(res => res.json())
            .then(json => {
                //console.log(json);
                this.setState({
                    tableData: json
                }, () => {
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
                            //console.log(json);
                            var tableData = this.state.tableData;
                            tableData.forEach(element => {
                                json.forEach(quiz => {
                                    if (quiz.id === element.quizId) {
                                        element.quizId = quiz.name;
                                    }
                                })
                            });
                            this.setState({ tableData: tableData });
                        });
                })
            });
    }
}

export default UserResultsTab;
