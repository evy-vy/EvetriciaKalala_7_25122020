
//route comment

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const commentCtrl = require('../controllers/comment');

router.post('/', /*auth,*/  commentCtrl.createComment);
// router.get('/', /*auth,*/ commentCtrl.getAllComment);
router.put('/:id', /*auth,*/  commentCtrl.updateComment);
router.delete('/:id', /*auth,*/ commentCtrl.deleteComment);
// router.get('/:id', /*auth,*/ commentCtrl.getOneComment);

module.exports = router;
