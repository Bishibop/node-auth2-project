const router = require('express').Router();

const Users = require('./users-model.js');
const restricted = require("../auth/restricted.js");

router.get('/', restricted, (req, res) => {
  // STRETCH
  Users.find().where({department: req.decodedJwt.department})
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.send(err));
});

module.exports = router;
