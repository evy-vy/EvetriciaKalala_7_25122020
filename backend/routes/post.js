//route post

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const postCtrl = require('../controllers/post');


router.post('/', multer, postCtrl.createPost);
// router.post('/:id/like', auth, postCtrl.likeOrDislikePost);
// router.delete('/:id', auth, postCtrl.deletePost);
// router.put('/:id', auth, multer, postCtrl.modifyPost);
// router.get('/:id', auth, postCtrl.getOnePost);
// router.get('/', auth, postCtrl.getAllpPost);






module.exports = router;