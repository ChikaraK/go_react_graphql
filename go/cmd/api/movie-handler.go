package main

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

func (app *application) getOneMovie(w http.ResponseWriter, r *http.Request) {
	paramas := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(paramas.ByName("id"))
	if err != nil {
		app.logger.Print(errors.New("invalid id parameters"))
		app.errorJson(w, err)
		return
	}

	app.logger.Println("Id is", id)

	movie, err := app.models.DB.Get(id)

	if err != nil {
		app.logger.Println(err)
	}

	err = app.writeJson(w, http.StatusOK, movie, "movie")
	if err != nil {
		app.errorJson(w, err)
		return
	}
}

func (app *application) getAllMovie(w http.ResponseWriter, r *http.Request) {
	movies, err := app.models.DB.All()
	if err != nil {
		app.errorJson(w, err)
		return
	}

	err = app.writeJson(w, http.StatusOK, movies, "movies")
	if err != nil {
		app.errorJson(w, err)
		return
	}
}

func (app *application) deleteMovie(w http.ResponseWriter, r *http.Request) {

}

func (app *application) insertMovie(w http.ResponseWriter, r *http.Request) {

}

func (app *application) updateMovie(w http.ResponseWriter, r *http.Request) {

}

func (app *application) searchMovie(w http.ResponseWriter, r *http.Request) {

}
