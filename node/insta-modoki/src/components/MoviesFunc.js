import React, {useEffect, useState, Fragment} from 'react'
import {Link} from 'react-router-dom'

function MoviesFunc(props) {

    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_DEV_API_URL}/v1/movies`)
            .then((response) => {
                if (response.status !== 200) {
                    setError("Invalid response code: ", response.status)
                } else {
                    setError(null);
                }
                return response.json();
            })
            .then((json) => {
                setMovies(json.movies)
            })
    },[]); // ** Must set default value
    if (error != null) {
        return <div>Error: {error.message}</div>
    } else {
        return (
        <Fragment>
            <h2>Choose a movie</h2>
            <div className="list-group">
                {movies.map( (m) => (
                    <Link 
                        key={m.id}
                        to={`/movie/${m.id}`}
                        className="list-group-item list-group-item-aciton"
                    >
                    {m.title}
                    </Link>
                ))}
            </div>
        </Fragment>
        );
    }
}

export default MoviesFunc