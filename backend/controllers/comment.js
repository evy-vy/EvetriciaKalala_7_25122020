const models = require('../models');
const comment_limit = 4;

//create Comment
exports.createComment = (req, res, next) => {

  const comment = req.body.comment;
  const postId = req.body.postId;
  const userId = req.body.userId;

  if (comment.lenght === 0) {

    return res.status(400).json({ error, message: "please, fill in the blanks ! " });
  }

  if (comment.lenght <= comment_limit) {
    return res.status(400).json({ error, message: " invalid parameters " });

  }

  models.Comment.create({

    comment: comment,
    PostId: postId,
    userId: userId,
  })
    .then(comment => {
      res.status(200).json({ comment })
    })
    .catch(error => res.status(500).json({ error }))
};


//récupération de tous le commentaires
exports.getAllComments = (req, res, next) => {

  const postId = req.params.postId;

  models.Comment.findAll({
    where: { postId: postId },
    include: [{
      model: models.Post,
    }],
    order: [['createdAt', 'DESC']],
  })
    .then(comments => {
      if (!comments) {
        return res.status(404).json({ error: 'empty' })
      } else {
        return res.status(200).json({ comments })
      }
    })
    .catch(error => res.status(500).json({ error }))
};


//delete comment
exports.deleteComment = (req, res, next) => {
  const currentUserId = req.body.currentUserId;
  const isAdmin = req.body.isAdmin;
  const commentId = req.params.id;

  models.Comment.findOne({ where: { id: commentId } })
    .then(comment => {
      if (isAdmin || currentUserId == comment.userId) {
        comment.destroy();
        res.status(200).json({ message: "Comment deleted" });

      } else {
        res.status(401).json({ message: "Unauthorized to delete this comment" });
      };
    })
    .catch(error => res.status(500).json({ error }));
};