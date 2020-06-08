const bcryptjs = require('bcryptjs');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department
  };

  const options = {
    expiresIn: '1d'
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}

router.post('/register', async (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 8);
  credentials.password = hash;

  try {
    const saved = await Users.add(credentials);
    const token = generateToken(saved);
    res.status(201).json({data: saved, token});
  } catch (err) {
    res.status(500).json(error);
  }
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username }).first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({
          message: `Welcome ${user.username}!, have a token...`,
          token,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials '});
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
