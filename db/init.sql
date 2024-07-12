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

CREATE TABLE chatlog (
   id SERIAL PRIMARY KEY,
   message_from VARCHAR(100),
   message_to VARCHAR(100),
   message TEXT
);
