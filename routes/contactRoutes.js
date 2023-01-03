var express = require('express');
var router = express.Router();
const { contactForm, readContactForm} = require('../controllers/contactController');


router.post('/contact', contactForm);
router.get('/messages', readContactForm);

module.exports = router;
