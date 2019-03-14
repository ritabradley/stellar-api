const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const port = 3000;
const cors = require('cors');
const app = express();

const saltRounds = 10;

app.use(bodyParser.json());
app.use(cors());
const database = {
  users: [
    {
      id: '001',
      name: 'Rita',
      email: 'rita@email.com',
      password: 'stickybuns',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '002',
      name: 'Isaiah',
      email: 'isaiah@email.com',
      password: 'frutiipebbles',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '003',
      name: 'Evan',
      email: 'evan@email.com',
      password: 'dunarulez',
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: '474',
      hash: '',
      email: 'evan@email.com',
    },
  ],
};

// ~~>  root
app.get('/', (req, res) => {
  res.send(database.users);
});

// signin ~~> POST = success/fail
app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  // check a password
  bcrypt.compare(
    password,
    '$2b$10$yyPNTwWosMWLLugR.0AV2O2rypPLnMxMJvqbw8.fBQG16uF9hsfOS',
    function(err, res) {
      // res == true
      console.log('first guess', res);
    },
  );
  bcrypt.compare(
    'pothead',
    '$2b$10$yyPNTwWosMWLLugR.0AV2O2rypPLnMxMJvqbw8.fBQG16uF9hsfOS',
    function(err, res) {
      // res == false
      console.log('second guess', res);
    },
  );
  let successful = false;
  database.users.forEach(user => {
    if (email === user.email && password === user.password) {
      successful = true;
      return res.json(database.users[0]);
    }
  });
  if (!successful) {
    res.status(404).json('error while signing in...');
  }
});

// register ~~> POST  = user
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  // hash a password
  bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    console.log(hash);
  });
  database.users.push({
    id: '004',
    name,
    email,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

// profile/:userId GET = user
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).json('no such user found');
  }
});

// image ~~> PUT  ~~> user
app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json('no such user found');
  }
});

app.listen(port, console.log(`Now listening on port: ${port}...`));
