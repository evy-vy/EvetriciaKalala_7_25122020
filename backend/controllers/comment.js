//create Comment

const models = require('../models');
const comment_limit = 4;

exports.createComment = (req, res, next) => {

  console.log('req: ', req)
  console.log('body: ', req.body)

  const comment = req.body.comment;
  const postId = req.body.postId;
  const userId = req.body.userId;
  // console.log('comment: ', comment)
  console.log('postId: ', postId)
  console.log('userId: ', userId)
  if (comment.lenght === 0) { //.trim à mettre en place pour éviter les espaces et les tab
    console.log('coucou');

    return res.status(400).json({ error, message: "please, fill in the blanks ! " });
  }

  if (comment.lenght <= comment_limit) {
    console.log('c\'est moi');
    return res.status(400).json({ error, message: " invalid parameters " });

  }
  console.log('cococinelle!');

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

exports.getAllComments = (req, res, next) => {
  const postId = req.params.postId;
  console.log('coucou');
  models.Comment.findAll({
    where: { postId: postId },
    include: [{
      model: models.Post,
      // attributes: ['postId']
    }],
    order: [['createdAt', 'DESC']],
  })
    .then(comments => {
      console.log('par ici');
      console.log(comments);
      if (!comments) {
        console.log('ici');
        return res.status(404).json({ error: 'empty' })
      } else {
        console.log('et la');
        return res.status(200).json({ comments })
      }
    })
    .catch(error => res.status(500).json({ error }))
};


//modify a comment
// exports.updateComment = (req, res, post) => {

//   const comment = req.body.comment;
//   // const postId = req.body.postId;
//   // const userId = req.params.userId;

//   const commentId = req.params.id;

//   console.log('comment id : ', commentId)
//   if (!req.body.comment) {
//     return res.status(400).json({ error: "empty content!" });
//   }

//   models.Comment.update(
//     {
//       // postId: postId,
//       comment: comment,
//       // userId: userId
//     },
//     {
//       where: { id: commentId }
//     })

//     .then(() => {
//       res.status(200).json({ message: 'successfully updated' })
//     })
//     .catch(error => res.status(500).json({ error }));
// };

//delete comment
//delete a retravailler (voir pour admin)
exports.deleteComment = (req, res, next) => {
  // const userId = req.body.userId;
  const commentId = req.params.id;

  //bouchon
  let isAdmin = false; /* ex: localstorage.curentUser.isAdmin */
  let currentUserId = 1; /* ex: localstorage.curentUser.id */

  console.log('isAdmin: ', isAdmin)
  models.Comment.findOne({ where: { id: commentId } })
    .then(comment => {
      if (isAdmin || currentUserId == comment.userId) {
        console.log(' autorise')
        comment.destroy();
        res.status(200).json({ message: "Comment deleted" });

      } else {
        console.log('pas autorise')
        res.status(401).json({ message: "Unauthorized to delete this comment" });
      };
    })
    .catch(error => res.status(500).json({ error }));
};