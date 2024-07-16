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
	ID        int `json:"id"`
	User1_id  int `json:"user1_id"`
	User2_id  int `json:"user2_id"`
	User1_pid int `json:"user1_pid"`
	User2_pid int `json:"user2_pid"`
}

type Chat struct {
	ID          int    `json:"id"`
	From        int    `json:"from_pid"`
	To          int    `json:"to_pid"`
	From_userid int    `json:"from_userid"`
	To_userid   int    `json:"to_userid"`
	Msg         string `json:"msg"`
}

type Profile struct {
	ID     int    `json:"id"`
	UserID int    `json:"user_id"`
	Name   string `json:"name"`
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
		users := getAllUsers(db)
		c.JSON(http.StatusOK, users)
	})

	// get user by name
	r.GET("/get/user/:name", func(c *gin.Context) {
		name := c.Param("name")
		users := getUserByName(db, name)
		c.JSON(http.StatusOK, users)
	})

	// get chat log
	// r.GET("/get/chatlog/id/:user1/:user2", func(c *gin.Context) {
	// 	user1 := c.Param("user1")
	// 	user2 := c.Param("user2")
	// 	chatlogs := getChatLogsByPid(db, user1, user2)
	// 	c.JSON(http.StatusOK, chatlogs)
	// })
	// r.GET("/get/chatlog/pid/:user1/:user2", func(c *gin.Context) {
	// 	user1 := c.Param("user1")
	// 	user2 := c.Param("user2")
	// 	chatlogs := getChatLogs(db, user1_id, user2_id)
	// 	c.JSON(http.StatusOK, chatlogs)
	// })

	// get user`s friends profile
	r.GET("/get/friends/id/:name", func(c *gin.Context) {
		name := c.Param("name")
		data := getUserByName(db, name)
		friends := getFriendsByID(db, data[0].ID)
		var Friends []Profile
		for i := 0; i < len(friends); i++ {
			var Profile Profile
			if friends[i].User1_id != data[0].ID {
				Profile.UserID = friends[i].User1_id
				Profile.ID = friends[i].User1_pid
				friend_profile := getProfilesByPid(db, friends[i].User1_pid)[0]
				Profile.Name = friend_profile.Name
				Friends = append(Friends, Profile)
			} else {
				Profile.UserID = friends[i].User2_id
				Profile.ID = friends[i].User2_pid
				friend_profile := getProfilesByPid(db, friends[i].User2_pid)[0]
				Profile.Name = friend_profile.Name
				Friends = append(Friends, Profile)
			}
		}
		c.JSON(http.StatusOK, Friends)
	})

	r.GET("/get/friends/pid/:name/:pname", func(c *gin.Context) {
		name := c.Param("name")
		pname := c.Param("pname")
		id := getUserByName(db, name)[0].ID
		pid := getProfileByIdName(db, id, pname)[0].ID
		friends := getFriendsByPidName(db, pid)
		var Friends []Profile
		for i := 0; i < len(friends); i++ {
			var Profile Profile
			if friends[i].User1_pid != pid {
				Profile.UserID = friends[i].User1_id
				Profile.ID = friends[i].User1_pid
				friend_profile := getProfilesByPid(db, friends[i].User1_pid)[0]
				Profile.Name = friend_profile.Name
				Friends = append(Friends, Profile)
			} else {
				Profile.UserID = friends[i].User2_id
				Profile.ID = friends[i].User2_pid
				friend_profile := getProfilesByPid(db, friends[i].User2_pid)[0]
				Profile.Name = friend_profile.Name
				Friends = append(Friends, Profile)
			}
		}
		c.JSON(http.StatusOK, Friends)
	})

	// get users profile
	r.GET("/get/profile/:name", func(c *gin.Context) {
		name := c.Param("name")
		data := getUserByName(db, name)
		profiles := getProfilesByUserID(db, data[0].ID)
		c.JSON(http.StatusOK, profiles)
	})

	// create user
	r.GET("/add/user/:name/:pass", func(c *gin.Context) {
		name := c.Param("name")
		pass := c.Param("pass")
		db.Exec("INSERT INTO users (,pass) VALUES ($1,$2)", name, pass)
	})

	// send msg
	r.GET("/send/msg/:from/:to/:msg", func(c *gin.Context) {
		from := c.Param("from")
		to := c.Param("to")
		msg := c.Param("msg")
		db.Exec("INSERT INTO chatlog (msg_from, msg_to, msg) VALUES ($1,$2,$3)", from, to, msg)
	})

	// start server
	port := ":8080"
	r.Run(port)
	select {}
}

func getAllUsers(db *sql.DB) []User {
	rows, err := db.Query("SELECT * FROM users")
	if err != nil {
		return nil
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.ID, &user.Name, &user.Pass); err != nil {
			return nil
		}
		users = append(users, user)
	}
	return users
}

func getUserByName(db *sql.DB, name string) []User {
	rows, err := db.Query("SELECT * FROM users WHERE uname=$1", name)
	if err != nil {
		return nil
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.ID, &user.Name, &user.Pass); err != nil {
			return nil
		}
		users = append(users, user)
	}
	return users
}

func getChatLogsByID(db *sql.DB, id1 int, id2 int) []Chat {
	rows, err := db.Query("SELECT * FROM chatlog WHERE (from_userid=$1 and to_userid=$2) or (from_userid=$2 and to_userid=$1)", id1, id2)
	if err != nil {
		return nil
	}
	defer rows.Close()

	var chatlogs []Chat
	for rows.Next() {
		var chatlog Chat
		if err := rows.Scan(&chatlog.ID, &chatlog.From, &chatlog.To, &chatlog.Msg); err != nil {
			return nil
		}
		chatlogs = append(chatlogs, chatlog)
	}
	return chatlogs
}
func getChatLogsByPid(db *sql.DB, pid1 int, pid2 int) []Chat {
	rows, err := db.Query("SELECT * FROM chatlog WHERE (from_pid=$1 and to_pid=$2) or (from_pid=$2 and to_pid=$1)", pid1, pid2)
	if err != nil {
		return nil
	}
	defer rows.Close()

	var chatlogs []Chat
	for rows.Next() {
		var chatlog Chat
		if err := rows.Scan(&chatlog.ID, &chatlog.From, &chatlog.To, &chatlog.Msg); err != nil {
			return nil
		}
		chatlogs = append(chatlogs, chatlog)
	}
	return chatlogs
}

func getFriendsByID(db *sql.DB, id int) []Friend {
	rows, err := db.Query("SELECT * FROM friends WHERE user1_id=$1 or user2_id=$1", id)
	if err != nil {
		return nil
	}
	defer rows.Close()

	var friends []Friend
	for rows.Next() {
		var friend Friend
		if err := rows.Scan(&friend.ID, &friend.User1_id, &friend.User2_id, &friend.User1_pid, &friend.User2_pid); err != nil {
			return nil
		}
		friends = append(friends, friend)
	}
	return friends
}
func getFriendsByPidName(db *sql.DB, pid int) []Friend {
	rows, err := db.Query("SELECT * FROM friends WHERE (user1_pid=$1 and user1_id=$1) or (user2_pid=$1 and user2_id=$2)", pid)
	if err != nil {
		return nil
	}
	defer rows.Close()

	var friends []Friend
	for rows.Next() {
		var friend Friend
		if err := rows.Scan(&friend.ID, &friend.User1_id, &friend.User2_id, &friend.User1_pid, &friend.User2_pid); err != nil {
			return nil
		}
		friends = append(friends, friend)
	}
	return friends
}

func getProfilesByUserID(db *sql.DB, user_pid int) []Profile {
	rows, err := db.Query("SELECT * FROM profile WHERE user_id=$1", user_pid)
	if err != nil {
		return nil
	}
	defer rows.Close()

	var profiles []Profile
	for rows.Next() {
		var profile Profile
		if err := rows.Scan(&profile.ID, &profile.UserID, &profile.Name); err != nil {
			return nil
		}
		profiles = append(profiles, profile)
	}
	return profiles
}
func getProfilesByPid(db *sql.DB, user_pid int) []Profile {
	rows, err := db.Query("SELECT * FROM profile WHERE id=$1", user_pid)
	if err != nil {
		return nil
	}
	defer rows.Close()

	var profiles []Profile
	for rows.Next() {
		var profile Profile
		if err := rows.Scan(&profile.ID, &profile.UserID, &profile.Name); err != nil {
			return nil
		}
		profiles = append(profiles, profile)
	}
	return profiles
}
func getProfileByIdName(db *sql.DB, id int, name string) []Profile {
	rows, err := db.Query("SELECT * FROM profile WHERE user_id=$1 and name=$2", id, name)
	if err != nil {
		return nil
	}
	defer rows.Close()

	var profiles []Profile
	for rows.Next() {
		var profile Profile
		if err := rows.Scan(&profile.ID, &profile.UserID, &profile.Name); err != nil {
			return nil
		}
		profiles = append(profiles, profile)
	}
	return profiles
}
