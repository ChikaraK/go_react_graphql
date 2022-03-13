package main

import (
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/pascaldekloe/jwt"
)

func (app *application) enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (app *application) checkToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Authorization")

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			// could set an anonymous user
		}

		headerParts := strings.Split(authHeader, " ")
		if len(headerParts) != 2 {
			app.errorJson(w, errors.New("invalid auth header"))
			return
		}

		if headerParts[0] != "Bearer" {
			app.errorJson(w, errors.New("unauthorized - no bearer"))
			return
		}

		token := headerParts[1]

		claims, err := jwt.HMACCheck([]byte(token), []byte(app.config.jwt.secret))
		if err != nil {
			app.errorJson(w, errors.New("unauthorized - failed hmac check"), http.StatusForbidden)
			return
		}

		if !claims.Valid(time.Now()) {
			app.errorJson(w, errors.New("unauthorized - token expired"), http.StatusForbidden)
			return
		}

		if !claims.AcceptAudience("mydomain.com") {
			app.errorJson(w, errors.New("unauthorized - invalid audience"), http.StatusForbidden)
			return
		}

		if claims.Issuer != "mydomain.com" {
			app.errorJson(w, errors.New("unauthorized - invalid issuer"), http.StatusForbidden)
			return
		}

		userID, err := strconv.ParseInt(claims.Subject, 10, 64)
		if err != nil {
			app.errorJson(w, errors.New("unauthorized"), http.StatusForbidden)
			return
		}

		log.Println("valid user :", userID)

		next.ServeHTTP(w, r)
	})
}
