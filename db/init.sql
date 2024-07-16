DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mydatabase') THEN
      CREATE DATABASE mydatabase;
   END IF;
END
$$;

DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'myuser') THEN
      CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';
   END IF;
END
$$;

GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;

\connect mydatabase;

CREATE TABLE IF NOT EXISTS users (
   id SERIAL PRIMARY KEY,
   uname VARCHAR(100),
   pass VARCHAR(100)
);


create Table friends(
   id SERIAL PRIMARY KEY,
   user1_id INT,
   user2_id int,
   user1_pid INT,
   user2_pid INT
);

create Table profile(
   id SERIAL PRIMARY KEY,
   user_id INT,
   name VARCHAR(100)
);

CREATE TABLE chatlog (
   id SERIAL PRIMARY KEY,
   from_pid INT,
   to_pid INT,
   from_userid INT,
   to_userid INT,
   msg TEXT
);
INSERT INTO users (uname,pass) VALUES ('root','root');
INSERT INTO users (uname,pass) VALUES ('kmjak','admin');
INSERT INTO users (uname,pass) VALUES ('user1','user');
INSERT INTO users (uname,pass) VALUES ('user2','user');
INSERT INTO friends (user1_id,user2_id,user1_pid,user2_pid) VALUES (3,1,3,1);
INSERT INTO friends (user1_id,user2_id,user1_pid,user2_pid) VALUES (1,2,4,6);
INSERT INTO friends (user1_id,user2_id,user1_pid,user2_pid) VALUES (1,4,4,7);
INSERT INTO chatlog (from_pid,to_pid,from_userid,to_userid,msg) VALUES (1,3,1,3,'Hello');
INSERT INTO chatlog (from_pid,to_pid,from_userid,to_userid,msg) VALUES (4,6,1,2,'Next.js');
INSERT INTO chatlog (from_pid,to_pid,from_userid,to_userid,msg) VALUES (4,6,1,2,'Go');
INSERT INTO chatlog (from_pid,to_pid,from_userid,to_userid,msg) VALUES (6,4,2,1,'lang');
INSERT INTO chatlog (from_pid,to_pid,from_userid,to_userid,msg) VALUES (4,7,1,4,'Hi');

INSERT INTO profile (user_id,name) VALUES (1,'root');
INSERT INTO profile (user_id,name) VALUES (2,'kmjak');
INSERT INTO profile (user_id,name) VALUES (3,'user1');
INSERT INTO profile (user_id,name) VALUES (1,'dog');
INSERT INTO profile (user_id,name) VALUES (1,'cat');
INSERT INTO profile (user_id,name) VALUES (2,'cat');
INSERT INTO profile (user_id,name) VALUES (4,'cat');
