package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"insta-modoki/models"
	"net/http"
	"time"

	"github.com/pascaldekloe/jwt"
	"golang.org/x/crypto/bcrypt"
)

var validUser = models.User{
	ID:       10,
	Email:    "hogehoge@hoge.com",
	Password: "$2a$12$dxXVesi7dVYt48cYd4vuCODEAPAKk5wxqWJ3Xlo4WR5ASIUvU0kuC",
}

type Credentials struct {
	Username string `json:"email"`
	Password string `json:"password"`
}

func (app *application) Signin(w http.ResponseWriter, r *http.Request) {
	var creds Credentials

	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		app.errorJson(w, errors.New("unauthorized"))
		return
	}

	hashsedPassword := validUser.Password

	err = bcrypt.CompareHashAndPassword([]byte(hashsedPassword), []byte(creds.Password))
	if err != nil {
		app.errorJson(w, errors.New("unauthorized"))
		return
	}

	var claims jwt.Claims
	claims.Subject = fmt.Sprint(validUser.ID)
	claims.Issued = jwt.NewNumericTime(time.Now())
	claims.NotBefore = jwt.NewNumericTime(time.Now())
	claims.Expires = jwt.NewNumericTime(time.Now().Add(24 * time.Hour))
	claims.Issuer = "mydomain.com"
	claims.Audiences = []string{"mydomain.com"}

	jwtBytes, err := claims.HMACSign(jwt.HS256, []byte(app.config.jwt.secret))
	if err != nil {
		app.errorJson(w, errors.New("unauthorized"))
		return
	}

	app.writeJson(w, http.StatusOK, string(jwtBytes), "response")

}
