const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const PORT = process.env.PORT;
const cors = require('cors');
const app = express();
const saltRounds = 10;
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

db.select('id', 'name', 'email').from('users');

app.use(bodyParser.json());
app.use(cors());

// ~~>  root
app.get('/', (req, res) => {
  res.send(`up and running`);
});

// signin ~~> POST = success/fail
app.post('/signin', (req, res) => {
  signin.handleSignIn(res, req, db, bcrypt);
});

// register ~~> POST  = user
app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt, saltRounds);
});

// profile/:userId GET = user
app.get('/profile/:id', (req, res) => {
  profile.handleProfile(req, res, db);
});

// image ~~> PUT  ~~> user
app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});

// image ~~> POST
app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});
app.listen(PORT || 3000, console.log(`Now listening on port: ${PORT}...`));
