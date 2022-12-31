var express = require('express');
var router = express.Router();
const { newsletter, read, readAll } = require('../controllers/emailController')

router.post('/create', newsletter)
router.get('/users', readAll)

module.exports = router;