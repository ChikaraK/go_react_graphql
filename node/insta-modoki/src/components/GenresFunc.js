import React, {useEffect, useState, Fragment} from 'react'
import {Link} from 'react-router-dom'

function GenresFunc(props) {
    const[genres, setGenres] = useState([]);
    const[error, setError] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_DEV_API_URL}/v1/genres/`)
        .then((response) => {
            if (response.status !== 200) {
                setError("Invalid response:", response.status)
            } else {
                setError(null);
            }
            return response.json();
        })
        .then((json) => {
            setGenres(json.genres)
        })
    }, []);

    if(error != null) {
        return <div>Error: {error.message}</div>
    } else {
        return (
            <Fragment>
                <h2>Genres</h2>
                <div className="list-group">
                    {genres.map((m) => (
                        <Link 
                            key={m.id}
                            to={{
                                pathname: `/genre/${m.id}`,
                                genreName : m.genre_name,
                            }}
                            className="list-group-item list-group-item-aciton"
                        >
                            {m.genre_name}
                        </Link>
                    ))}
                </div>
            </Fragment>
        )
    }
}

export default GenresFunc