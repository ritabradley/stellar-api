const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const port = 3000;
const cors = require('cors');
const app = express();
const saltRounds = 10;
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'Saiahs#1',
    database: 'stellar',
  },
});

db.select('id', 'name', 'email').from('users');

app.use(bodyParser.json());
app.use(cors());

// ~~>  root
app.get('/', (req, res) => {
  res.send(database.users);
});

// signin ~~> POST = success/fail
app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  db.select('email', 'hash')
    .from('login')
    .where({ email })
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where({ email })
          .then(user => res.json(user[0]))
          .catch(err => res.status(400).json('unable to get user'));
      } else {
        res.status(400).json('invalid credentials');
      }
    })
    .catch(err => res.status(400).json('invalid credentials'));
});

// register ~~> POST  = user
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password, saltRounds);
  db.transaction(trx => {
    trx
      .insert({ hash, email })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            name,
            email: loginEmail[0],
            joined: new Date(),
          })
          .then(user => {
            res.json(user[0]);
          });
      })
      .then(trx.commt)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json('unable to register'));
});

// profile/:userId GET = user
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({
      id,
    })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json('not found');
      }
    })
    .catch(err => res.status(404).json('error retrieving user'));
});

// image ~~> PUT  ~~> user
app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where({ id })
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(404).json('error retreiving entries'));
});

app.listen(port, console.log(`Now listening on port: ${port}...`));
