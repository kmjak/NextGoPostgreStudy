package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Pass string `json:"pass"`
}

func main() {

	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	r.Use(cors.New(config))

	// DB connection
	dsn := "postgres://myuser:mypassword@db:5432/mydatabase?sslmode=disable"
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	// get all users
	r.GET("/get/users", func(c *gin.Context) {
		rows, err := db.Query("SELECT id, uname, pass FROM users")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var users []User
		for rows.Next() {
			var user User
			if err := rows.Scan(&user.ID, &user.Name, &user.Pass); err != nil {
				return
			}
			users = append(users, user)
		}
		c.JSON(http.StatusOK, users)
	})

	// get user by name
	r.GET("/get/user/:name", func(c *gin.Context) {
		name := c.Param("name")
		rows, err := db.Query("SELECT id, uname, pass FROM users WHERE uname=$1", name)
		if err != nil {
			return
		}
		defer rows.Close()

		var users []User
		for rows.Next() {
			var user User
			if err := rows.Scan(&user.ID, &user.Name, &user.Pass); err != nil {
				return
			}
			users = append(users, user)
		}

		c.JSON(http.StatusOK, users)
	})
	// create user
	r.GET("/add/user/:name/:pass", func(c *gin.Context) {
		name := c.Param("name")
		pass := c.Param("pass")
		_, err := db.Exec("INSERT INTO users (uname,pass) VALUES ($1)", name, pass)
		if err != nil {
			return
		}
	})

	// start server
	port := ":8080"
	r.Run(port)
	select {}
}
