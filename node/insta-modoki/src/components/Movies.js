import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
export default class Movies extends Component {

    state = { movies: []}

    componentDidMount(){
        this.setState({
            movies:[
                {id: 1, title: "Men in Black", runtime: 142},
                {id: 2, title: "The Godfather", runtime: 175},
                {id: 3, title: "The Dark Knignt", runtime: 152},
            ]
        })
    }

    render () {
        return (
            <Fragment>
                <h2>Choose a movie</h2>
                <ul>
                    {this.state.movies.map( (m) => (
                        <li key={m.id}>
                            <Link to={`/movie/${m.id}`}>{m.title}</Link>
                        </li>
                    ))}
                </ul>
            </Fragment>
        );   
    }
}