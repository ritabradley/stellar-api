const Clarifai = require('clarifai');
const app = new Clarifai.App({
  apiKey: '5e6319488c3e4d4188e84f5844603111',
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => res.status(400).json('unable to call API'));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where({ id })
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(404).json('error retreiving entries'));
};

module.exports = {
  handleImage,
  handleApiCall,
};
