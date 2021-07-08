//route user

const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/me', userCtrl.getUserProfile);
// router.put('/:id', auth, userCtrl.modifyPassword);
router.delete('/:id', userCtrl.deleteUser);

module.exports = router;

