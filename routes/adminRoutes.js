var express = require('express');
var router = express.Router();
const { signUp, signIn, signOut } = require('../controllers/adminController');


router.post('/create', signUp);
router.post('/login', signIn);
router.post('/logout', signOut);

module.exports = router;