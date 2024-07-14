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

type Friend struct {
	ID    int    `json:"id"`
	User1 string `json:"user1"`
	User2 string `json:"user2"`
}

type Chat struct {
	ID   int    `json:"id"`
	From string `json:"from"`
	To   string `json:"to"`
	Msg  string `json:"msg"`
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
	// get chat log
	r.GET("/get/chatlog/:user1/:user2", func(c *gin.Context) {
		user1 := c.Param("user1")
		user2 := c.Param("user2")
		rows, err := db.Query("SELECT id, msg_from, msg_to, msg FROM chatlog WHERE (msg_from=$1 and msg_to=$2) or (msg_from=$2 and msg_to=$1)", user1, user2)
		if err != nil {
			return
		}
		defer rows.Close()
		var chatlogs []Chat
		for rows.Next() {
			var chatlog Chat
			if err := rows.Scan(&chatlog.ID, &chatlog.From, &chatlog.To, &chatlog.Msg); err != nil {
				return
			}
			chatlogs = append(chatlogs, chatlog)
		}
		c.JSON(http.StatusOK, chatlogs)
	})

	// get user`s friends
	r.GET("/get/friends/:name", func(c *gin.Context) {
		name := c.Param("name")
		rows, err := db.Query("SELECT id, user1, user2 FROM Friends WHERE user1=$1 or user2=$2", name, name)
		if err != nil {
			return
		}
		defer rows.Close()
		var friends []Friend
		for rows.Next() {
			var friend Friend
			if err := rows.Scan(&friend.ID, &friend.User1, &friend.User2); err != nil {
				return
			}
			friends = append(friends, friend)
		}
		c.JSON(http.StatusOK, friends)
	})

	// create user
	r.GET("/add/user/:name/:pass", func(c *gin.Context) {
		name := c.Param("name")
		pass := c.Param("pass")
		_, err := db.Exec("INSERT INTO users (,pass) VALUES ($1,$2)", name, pass)
		if err != nil {
			return
		}
	})

	// send msg
	r.GET("/send/msg/:from/:to/:msg", func(c *gin.Context) {
		from := c.Param("from")
		to := c.Param("to")
		msg := c.Param("msg")
		_, err := db.Exec("INSERT INTO chatlog (msg_from, msg_to, msg) VALUES ($1,$2,$3)", from, to, msg)
		if err != nil {
			return
		}
	})

	// start server
	port := ":8080"
	r.Run(port)
	select {}
}
