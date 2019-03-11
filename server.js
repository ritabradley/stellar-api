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
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json('success');
  } else {
    res.status(404).json('error while logging in...');
  }
  console.log('on the signin page...');
});

//register ~~> POST  = user
app.post('/register', (req, res) => {
  const {email, name, password} = req.body;
  database.users.push({
    id: '004',
      name,
      email,
      password,
      entries: 0,
      joined: new Date(),
  })
  res.json(database.users[database.users.length - 1]);
  console.log('on the registration page...');
});

//profile/:userId GET = user
app.get('/profile/:userId', (req, res) => {
  res.send('profile');
  console.log('on the profile page...');
});

//image ~~> PUT  ~~> user
app.put('/image', (req, res) => {
  res.send('image');
  console.log('image ranking...');
});

app.listen(port, console.log(`Now listening on port: ${port}...`));
