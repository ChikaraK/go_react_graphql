import React, { useEffect, useState, Fragment } from 'react'
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import './EditMovie.css'
import Input from './form-components/Input'
import TextArea from './form-components/TextArea';
import Select from './form-components/Select';
import Alert from './ui-components/Alert';
import {Link} from "react-router-dom";

function EditMovieFunc(props) {
    const [movie, setMovie] = useState([]);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState([]);
    const [alert, setAlert] = useState({type: "d-none", message:"" })
    const mpaaOptions = [
        {id: "G",    value:"G"},
        {id: "PG",   value:"PG"},
        {id: "PG14", value:"PG14"},
        {id: "R",    value:"R"},
        {id: "NC17", value:"NC17"},
    ];

    useEffect(() => {
        if(props.jwt === "") {
            props.history.push({
                pathname: "/login"
            });
            return;
        }
        const id = props.match.params.id;

        if (id > 0) {
            fetch(`${process.env.REACT_APP_DEV_API_URL}/v1/movie/` + id)
                .then((response) => {
                    if(response.status !== 200 ){
                        setError("Invalid response: ", response.status);
                    } else {
                        setError(null);
                    }
                    return response.json();
                })
                .then((json) => {
                    const releaseDate = new Date(json.movie.release_date);
                    json.movie.relase.date = releaseDate.toISOString().split("T")[0];
                    setMovie(json.movie);
                })
        }

    },[props.history, props.jwt, props.match.params.id])

    const handleChange = () => (evt) => {
        let value = evt.target.value; 
        let name = evt.target.name;
        setMovie({
            ...movie,
            [name]: value,
        })
    }

    const handleSubmit = () => (evt) => {
        evt.preventDefault();

        /// client side validation
        let errors = [];
        if (movie.title === "") {
            errors.push("title")
        }
        if (movie.release_date === "") {
            errors.push("release_date")
        }
        if (movie.runtime === "") {
            errors.push("runtime")
        }
        if (movie.mpaa_rating === "") {
            errors.push("mpaa_rating")
        }
        if (movie.rating === "") {
            errors.push("rating")
        }
        if (movie.description === "") {
            errors.push("description")
        }
        
        setErrors(errors)

        if(errors.lenght > 0) {
            return false;
        }

        const data = new FormData(evt.target);
        const payload = Object.fromEntries(data.entries());
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + props.jwt);

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: myHeaders,
        }
        fetch(`${process.env.REACT_APP_DEV_API_URL}/v1/admin/editmovie`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.error) {
                    setAlert({
                        alert: {type: "alert-danger", message: data.error.message},
                    })
                } else {
                    setAlert({
                        alert: {type: "alert-success", message: "Changes saved!"},
                    })
                    props.history.push({
                        pathname: "/admin",
                    });
                }
            })
    }

    const confirmDelete = () => (evt) => {
        confirmAlert({
            title: 'Delete Movie ?',
            message: 'Are you sure ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        const myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
                        myHeaders.append("Authorization", "Bearer " + props.jwt);
                        const requestOptions = {
                            method: 'DELETE',
                            headers: myHeaders,
                        }
                        fetch(
                            `${process.env.REACT_APP_DEV_API_URL}/v1/admin/deletemovie/` + movie.id, 
                            requestOptions
                        )
                        .then(response => response.json())
                        .then(data => {
                            if (data.error) {
                                setAlert({
                                    alert: {type: "alert-danger", message: data.error.message},
                                })
                            } else {
                                setAlert({
                                    alert: {type: "alert-success", message: "Movie Deleted!"},
                                })
                                props.history.push({
                                    pathname: "/admin",
                                })
                            }
                        })
                    }
                },
                {
                    label: 'No',
                    onClick: () => {}
                }
            ]
        });
    }

    function hasError(key) {
        return errors.indexOf(key) !== -1;
    }

    if (error != null) {
        return <div>Error: {error.message}</div>
    } else {
        return (
            <Fragment>
                <h2>Add/Edit Movie</h2>
                <Alert 
                    alertType={alert.type} 
                    alertMessage={alert.message}
                />
                <hr />
                <form onSubmit={handleSubmit}>
                    <input
                        type="hidden"
                        name="id"
                        id="id"
                        value={movie.id}
                        onChange={movie.id}
                    />

                    <Input 
                        title={"Title"}
                        type={'test'}
                        name={'title'}
                        value={movie.title}
                        handleChange={handleChange("title")}
                        className={hasError("title") ? "is-invalid" : ""}
                        errorDiv={hasError("title") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a title"}
                    />

                    <Input 
                        title={"Release Date"}
                        type={'date'}
                        name={'release_date'}
                        value={movie.release_date}
                        handleChange={handleChange("release_date")}
                        className={hasError("release_date") ? "is-invalid" : ""}
                        errorDiv={hasError("release_date") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a release_date"}
                    />

                    <Input 
                        title={"Runtime"}
                        type={'text'}
                        name={'runtime'}
                        value={movie.runtime}
                        handleChange={handleChange("runtime")}
                        className={hasError("runtime") ? "is-invalid" : ""}
                        errorDiv={hasError("runtime") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a runtime"}
                    />

                    <Select 
                        title={"MPAA Rating"}
                        name={"mpaa_rating"}
                        options={mpaaOptions}
                        vlaue={movie.mpaa_rating}
                        handleChange={handleChange("mpaa_rating")}
                        placeholder={"Choose..."}
                        className={hasError("mpaa_rating") ? "is-invalid" : ""}
                        errorDiv={hasError("mpaa_rating") ? "text-danger" : "d-none"}
                        errorMsg={"Please select a mpaa_rating"}
                    />

                    <Input 
                        title={"Rating"}
                        type={'text'}
                        name={'rating'}
                        value={movie.rating}
                        handleChange={handleChange("rating")}
                        className={hasError("rating") ? "is-invalid" : ""}
                        errorDiv={hasError("rating") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a rating"}
                    />

                    <TextArea
                        title={"Description"} 
                        name={"description"} 
                        value={movie.description}
                        rows={"3"}
                        handleChange={handleChange("description")}
                        className={hasError("description") ? "is-invalid" : ""}
                        errorDiv={hasError("description") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a description"}
                    />

                    <hr />
                    <button className="btn btn-primary">Save</button>
                    <Link to="/admin" className="btn btn-warning ms-1">
                        Cancel
                    </Link>
                    {movie.id > 0 && (
                        <a 
                            href="#!"
                            onClick={() => confirmDelete()}
                            className="btn btn-danger ms-1"
                        >
                            Delete
                        </a>
                    )}
                </form>

                {/* <div className="mt-3">
                    <pre>{JSON.stringify(this.state, null, 3)}</pre>
                </div> */}

            </Fragment>
        )
    }
}

export default EditMovieFunc