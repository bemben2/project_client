import React, { Component } from 'react';
import { Badge, Button, Panel } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import dateformat from 'dateformat';

class MasterResultsTab extends Component {
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
        
        return (
            <React.Fragment>
                <Panel>
                    <Panel.Heading>
                    To display results click on <Badge>Show Result</Badge> button
                    </Panel.Heading>
                    <Panel.Body>
                        < BootstrapTable
                            data={this.state.tableData}
                            hover pagination >
                            <TableHeaderColumn dataField='id' isKey >Quiz ID</TableHeaderColumn>
                            <TableHeaderColumn dataField='name'>Quiz Name</TableHeaderColumn>
                            <TableHeaderColumn dataField='category'>Category</TableHeaderColumn>
                            <TableHeaderColumn dataField='duration'>Duration</TableHeaderColumn>
                            <TableHeaderColumn dataField='level'>Level</TableHeaderColumn>
                            <TableHeaderColumn dataField='active'>Active</TableHeaderColumn>
                            <TableHeaderColumn dataField='button' dataFormat={this.showResultsButtonFormater} >Show Results</TableHeaderColumn>
                        </BootstrapTable >
                    </Panel.Body>
                </Panel>
            </React.Fragment>
        );
    }

    showResultsButtonFormater = (cell, row) => {
        return (
            <Button onClick={() => this.props.onClick(row, 'results')}>Show Results</Button>
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
    getFetch2 = () => {
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

export default MasterResultsTab;
