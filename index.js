const pg = require('pg');
const client = new pg.Client('postgres://localhost/relational_db');
const express = require('express');
const app = express();
const path = require('path');

const homePage = path.join(__dirname, 'index.html');
app.get('/', (req, res)=> res.sendFile(homePage));

const reactApp = path.join(__dirname, 'dist/main.js');
app.get('/dist/main.js', (req, res)=> res.sendFile(reactApp));

const reactSourceMap = path.join(__dirname, 'dist/main.js.map');
app.get('/dist/main.js.map', (req, res)=> res.sendFile(reactSourceMap));

const styleSheet = path.join(__dirname, 'styles.css');
app.get('/styles.css', (req, res)=> res.sendFile(styleSheet));

const init = async()=> {
  await client.connect();
  console.log('connected to database');
  const SQL = `
  DROP TABLE IF EXISTS things;
  DROP TABLE IF EXISTS users;
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100)

    );
    CREATE TABLE things(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE,
      user_id INTEGER REFERENCES users(id)

    );
    INSERT INTO users(name) VALUES ('moe');
    INSERT INTO users(name) VALUES ('lucy');
    INSERT INTO users(name) VALUES ('curly');
    INSERT INTO users(name) VALUES ('ethyl');
    INSERT INTO things(name, user_id) VALUES ('foo', (SELECT id FROM users WHERE name='moe'));
    INSERT INTO things(name, user_id) VALUES ('bar', (SELECT id FROM users WHERE name='moe'));
    INSERT INTO things(name, user_id) VALUES ('bazz', (SELECT id FROM users WHERE name='lucy'));
    INSERT INTO things(name, user_id) VALUES ('quq', (SELECT id FROM users WHERE name='curly'));
    `;
  await client.query(SQL)
  console.log('create your tables and seed data');

  const port = process.env.PORT || 4000;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
  });
}

init();
