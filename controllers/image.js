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
};
