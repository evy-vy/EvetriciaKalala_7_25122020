//route user

const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');


router.post('/', auth, multer, postCtrl.createPost);
// router.post('/:id/like', auth, postCtrl.likeOrDislikePost);
// router.delete('/:id', auth, postCtrl.deletePost);
// router.put('/:id', auth, multer, postCtrl.modifyPost);
// router.get('/:id', auth, postCtrl.getOnePost);
// router.get('/', auth, postCtrl.getAllpPost);






module.exports = router;