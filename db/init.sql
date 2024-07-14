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

INSERT INTO users (uname,pass) VALUES ('root', 'root');
INSERT INTO users (uname,pass) VALUES ('kmjak','admin');

create Table Friends(
   id SERIAL PRIMARY KEY,
   user1 VARCHAR(100),
   user2 VARCHAR(100)
);
INSERT INTO Friends (user1,user2) VALUES ('user1','root');

CREATE TABLE chatlog (
   id SERIAL PRIMARY KEY,
   msg_from VARCHAR(100),
   msg_to VARCHAR(100),
   msg TEXT
);
INSERT INTO chatlog (msg_from,msg_to,msg) VALUES ('root','user1','Hello');
INSERT INTO chatlog (msg_from,msg_to,msg) VALUES ('root','kmjak','Next.js');
INSERT INTO chatlog (msg_from,msg_to,msg) VALUES ('kmjak','root','Go');
INSERT INTO chatlog (msg_from,msg_to,msg) VALUES ('kmjak','root','lang');