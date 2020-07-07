const express = require('express');
const router = express.Router();

// router.post('/invite-signin', );
// router.get('/signin-invited/:token', );
// router.post('/signin', );
// router.post('/login', );
// router.post('/forgot-password', );
// router.post('/refresh-token', );
// router.post('/revoke-token', );

const inviteSignIn = (req, res, next) => {
  res.json('Invitation to signin sent!');
};

router.post('/invite-signin', inviteSignIn);

module.exports = router;