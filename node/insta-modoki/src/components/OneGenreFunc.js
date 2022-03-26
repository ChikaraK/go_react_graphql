import React, {useEffect, useState, Fragment} from 'react'
import {Link} from 'react-router-dom'

function OneGenreFunc(props) {
    let [movies, setMovies] = useState([]);
    let [genreName, setGenreName] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_DEV_API_URL}/v1/movies/` + props.match.params.id)
            .then((response) => {
                if (response.status !== 200) {
                    setError("Invalid response: ", response.status)
                } else {
                    setError(null);
                }
                return response.json();
            })
            .then((json) => {
                setGenreName(props.location.genreName)
                setMovies(json.movies)
            })
    }, [props.match.params.id, props.location.genreName]);

    if (!movies) {
        movies = [];
    }

    if(error != null) {
        return <div>Error:{error.message}</div>
    } else {
        return (
            <Fragment>
                <h2>Genre: {genreName}</h2>
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

export default OneGenreFunc