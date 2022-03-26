import React, { Component, Fragment } from 'react'
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import './EditMovie.css'
import Input from './form-components/Input'
import TextArea from './form-components/TextArea';
import Select from './form-components/Select';
import Alert from './ui-components/Alert';
import {Link} from "react-router-dom";

export default class EditMovie extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movie: {
                id: 0,
                title: "",
                release_date: "",
                runtime: "",
                mpaa_rating: "",
                rating: "",
                description: "",
            },
            mpaaOptions: [
                {id: "G",    value:"G"},
                {id: "PG",   value:"PG"},
                {id: "PG14", value:"PG14"},
                {id: "R",    value:"R"},
                {id: "NC17", value:"NC17"},
            ],
            isLoaded: false,
            error: null,
            errors: [], 
            alert: {
                type: "d-none",
                message: "",
            },
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (evt) => {
        evt.preventDefault();

        /// client side validation
        let errors = [];
        if (this.state.movie.title === "") {
            errors.push("title")
        }
        if (this.state.movie.release_date === "") {
            errors.push("release_date")
        }
        if (this.state.movie.runtime === "") {
            errors.push("runtime")
        }
        if (this.state.movie.mpaa_rating === "") {
            errors.push("mpaa_rating")
        }
        if (this.state.movie.rating === "") {
            errors.push("rating")
        }
        if (this.state.movie.description === "") {
            errors.push("description")
        }
        
        this.setState({errors: errors});

        if(errors.lenght > 0) {
            return false;
        }

        const data = new FormData(evt.target);
        const payload = Object.fromEntries(data.entries());
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + this.props.jwt);

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: myHeaders,
        }

        fetch(`${process.env.REACT_APP_DEV_API_URL}/v1/admin/editmovie`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.error) {
                    this.setState({
                        alert: { type: "alert-danger", message: data.error.message }
                    });
                } else {
                    this.setState({
                        alert: { type: "alert-success", message: "Changes saved!" }
                    });
                    this.props.history.push({
                        pathname: "/admin",
                    });
                }
            })
    }

    handleChange = (evt) => {
        let value = evt.target.value; 
        let name = evt.target.name;
        this.setState((prevState) => ({
            movie: {
                ...prevState.movie,
                [name]: value,
            }
        }))
    }

    hasError(key) {
        return this.state.errors.indexOf(key) !== -1;
    }

    componentDidMount() {
        if(this.props.jwt === "") {
            this.props.history.push({
                pathname: "/login"
            });
            return;
        }
        const id = this.props.match.params.id;
        if (id > 0) {
            fetch(`${process.env.REACT_APP_DEV_API_URL}/v1/movie/` + id)
                .then((response) => {
                    if(response.status !== '200'){
                        let err = Error;
                        err.Message = "Invalid response code" + response.status;
                        this.setState({error: err})
                    }
                    return response.json();
                })
                .then((json) => {
                    const releaseDate = new Date(json.movie.release_date);

                    this.setState(
                        {
                            movie: {
                                id: id,
                                title: json.movie.title,
                                runtime: json.movie.runtime,
                                mpaa_rating: json.movie.mpaa_rating,
                                rating: json.movie.rating,
                                description: json.movie.description,
                                release_date: releaseDate.toISOString().split("T")[0],
                            },
                            isLoaded: true,
                        },
                        (error) => {
                            this.setState({
                                isLoaded: true,
                                error,
                            })
                        }
                    )
                })
        } else {
            this.setState({isLoaded: true});
        }
    }

    confirmDelete = (e) => {
        confirmAlert({
            title: 'Delete Movie ?',
            message: 'Are you sure ?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Authorization", "Bearer " + this.props.jwt);
                    const requestOptions = {
                        method: 'DELETE',
                        headers: myHeaders,
                    }
                    fetch(
                        `${process.env.REACT_APP_DEV_API_URL}/v1/admin/deletemovie/` + this.state.movie.id, 
                        requestOptions
                    )
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            this.setState({
                                alert: {type: "alert-danger", message: data.error.message}
                            })
                        } else {
                            this.props.history.push({
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

    render () {
        let { movie, isLoaded, error } = this.state
        if(error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <p>Loading...</p>
        } else {
            return (
                <Fragment>
                    <h2>Add/Edit Movie</h2>
                    <Alert 
                        alertType={this.state.alert.type} 
                        alertMessage={this.state.alert.message}
                    />
                    <hr />
                    <form onSubmit={this.handleSubmit}>
                        <Input 
                            type={"hidden"}
                            name={"id"}
                            value={movie.id}
                            handleChange={this.handleChange}
                        />

                        <Input 
                            title={"Title"}
                            type={'test'}
                            name={'title'}
                            value={movie.title}
                            handleChange={this.handleChange}
                            className={this.hasError("title") ? "is-invalid" : ""}
                            errorDiv={this.hasError("title") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter a title"}
                        />

                        <Input 
                            title={"Release Date"}
                            type={'date'}
                            name={'release_date'}
                            value={movie.release_date}
                            handleChange={this.handleChange}
                            className={this.hasError("release_date") ? "is-invalid" : ""}
                            errorDiv={this.hasError("release_date") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter a release_date"}
                        />

                        <Input 
                            title={"Runtime"}
                            type={'text'}
                            name={'runtime'}
                            value={movie.runtime}
                            handleChange={this.handleChange}
                            className={this.hasError("runtime") ? "is-invalid" : ""}
                            errorDiv={this.hasError("runtime") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter a runtime"}
                        />

                        <Select 
                            title={"MPAA Rating"}
                            name={"mpaa_rating"}
                            options={this.state.mpaaOptions}
                            vlaue={movie.mpaa_rating}
                            handleChange={this.handleChange}
                            placeholder={"Choose..."}
                            className={this.hasError("mpaa_rating") ? "is-invalid" : ""}
                            errorDiv={this.hasError("mpaa_rating") ? "text-danger" : "d-none"}
                            errorMsg={"Please select a mpaa_rating"}
                        />

                        <Input 
                            title={"Rating"}
                            type={'text'}
                            name={'rating'}
                            value={movie.rating}
                            handleChange={this.handleChange}
                            className={this.hasError("rating") ? "is-invalid" : ""}
                            errorDiv={this.hasError("rating") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter a rating"}
                        />

                        <TextArea
                            title={"Description"} 
                            name={"description"} 
                            value={movie.description}
                            rows={"3"}
                            handleChange={this.handleChange}
                            className={this.hasError("description") ? "is-invalid" : ""}
                            errorDiv={this.hasError("description") ? "text-danger" : "d-none"}
                            errorMsg={"Please enter a description"}
                        />

                        <hr />
                        <button className="btn btn-primary">Save</button>
                        <Link to="/admin" className="btn btn-warning ms-1">
                            Cancel
                        </Link>
                        {movie.id > 0 && (
                            <a href="#!"onClick={() => this.confirmDelete()}
                            className="btn btn-danger ms-1">
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
}