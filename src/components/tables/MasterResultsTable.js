import React, { Component } from 'react';
import { Button, Badge, Panel } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import dateformat from 'dateformat';

class MasterResultsTable extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            tableData: null,
            quiz: this.props.quiz,
            results: null
        });
    }

    // componentDidUpdate(prevProps) {
    //     if (this.props.renderResults !== prevProps.renderResults) {
    //         this.getFetch();
    //     }
    // }

    render() {
        
        return (
            <React.Fragment>
                <Panel>
                    <Panel.Heading>
                        List of results for <Badge>{this.state.quiz.name}</Badge>
                    </Panel.Heading>
                    <Panel.Body>
                        < BootstrapTable
                            data={this.state.tableData}
                            hover pagination>
                            <TableHeaderColumn dataField='userName' >User Name</TableHeaderColumn>
                            <TableHeaderColumn isKey dataField='finishedAt' dataFormat={this.dateFormatter}>Finished At</TableHeaderColumn>
                            <TableHeaderColumn dataField='questionNo'>Questions No.</TableHeaderColumn>
                            <TableHeaderColumn dataField='answers' dataFormat={this.answersFormatter}>Results</TableHeaderColumn>
                        </BootstrapTable >
                    </Panel.Body>
                    <Panel.Footer>
                        <Button bsStyle="primary" onClick={this.props.onClick}>Back</Button>
                    </Panel.Footer>
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
        console.log("fefefefe");
        var url = `http://localhost:3000/api/results/quiz/${this.state.quiz.id}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.token
            }
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);
                this.setState({
                    tableData: json
                }, () => {
                    // var url = "http://localhost:3000/api/quizzes";
                    //  fetch(url, {
                    //      method: 'GET',
                    //      headers: {
                    //          'Content-Type': 'application/json',
                    //           'Authorization': 'Bearer ' + this.props.token
                    //      }
                    //  })
                    //      .then(res => res.json())
                    //      .then(json => {
                    //          //console.log(json);
                    //         var tableData = this.state.tableData;
                    //         tableData.forEach(element => {
                    //            json.forEach(quiz => {
                    //                if (quiz.id === element.quizId) {
                    //                    element.quizId = quiz.name;
                    //                }
                    //            })
                    //        });
                    //        this.setState({ tableData: tableData });
                    //    });
                })
            });
    }
}

export default MasterResultsTable;
