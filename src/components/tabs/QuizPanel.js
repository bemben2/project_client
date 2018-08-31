import React, { Component } from 'react';
import { Panel, Well,Button,Glyphicon } from 'react-bootstrap';

class QuizPanel extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            token: this.props.token,
            quiz: this.props.quiz,
            author: []
        });
    }

    componentDidMount() {
        this.getFetch();
    }

    render() {
        return (
            <Panel className="myPanel">
                <Panel.Heading>
                    <h4>
                    <Glyphicon glyph="star" />  {this.state.quiz.name}
                    </h4>
                </Panel.Heading>
                <Panel.Body>
                    <Well bsSize="small" >
                        Category: {this.state.quiz.category}<br></br>
                        Name: {this.state.quiz.name}<br></br>
                        Duration: {this.state.quiz.duration} minutes<br></br>
                    </Well>
                    <Button bsStyle="success" bsSize="small" onClick={()=>this.props.onClick(this.state.quiz)}>Take this quiz</Button>
                </Panel.Body>
                <Panel.Footer>
                    <i>by: {this.state.author.name}</i><br></br>
                    contact:
                    <a href={`mailto:${this.state.author.email}?Subject=${this.state.author.email}20%quiz`}
                        target="_top">{this.state.author.email}</a>
                </Panel.Footer>
            </Panel>
        );
    }

    getFetch = () => {
        var url = `http://localhost:3000/api/auth/${this.state.quiz.authorId}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.token
            }
        })
            .then(res => res.json())
            .then(json => {
                this.setState({ author: json });

            });
    }
}

export default QuizPanel;
