const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();

app.use(bodyParser.json());

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
};

// ~~>  root
app.get('/', (req, res) => {
  res.send(database.users);
  console.log('up and running...');
});

//signin ~~> POST = success/fail
app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  let successful = false;
  database.users.forEach(user => {
    if (email === user.email && password === user.password) {
      successful = true;
      return res.json('success');
    }
  });
  if (!successful) {
    res.status(404).json('error while signing in...');
  }
  console.log('on the signin page...');
});

//register ~~> POST  = user
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  database.users.push({
    id: '004',
    name,
    email,
    password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
  console.log('on the registration page...');
});

//profile/:userId GET = user
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
  console.log('on the profile page...');
});

//image ~~> PUT  ~~> user
app.put('/image', (req, res) => {
  res.send('image');
  console.log('image ranking...');
});

app.listen(port, console.log(`Now listening on port: ${port}...`));
