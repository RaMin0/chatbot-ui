package main

import (
	"log"
	"net/http"
	"os"

	_ "github.com/joho/godotenv/autoload"
)

func handle(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "templates/application.tmpl")
}

func main() {
	public := http.FileServer(http.Dir("public"))
	http.Handle("/stylesheets/", public)
	http.Handle("/javascripts/", public)
	http.Handle("/images/", public)
	http.Handle("/fonts/", public)

	http.HandleFunc("/", handle)

	port := os.Getenv("PORT")
	log.Printf("Listening on port %s...\n", port)
	log.Fatalln(http.ListenAndServe(":"+port, nil))
}
