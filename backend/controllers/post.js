const models = require('../models');
const fs = require('fs');


const title_limit = 2;
const content_limit = 4;


//routes 

//create a post
exports.createPost = (req, res, next) => {

  const userId = req.body.userId;
  const title = req.body.title;
  const content = req.body.content;
  const image = req.file;

  if (title.lenght === null && content.lenght === null) {
    return res.status(400).json({ error, message: "please, fill in the blanks ! " });
  }

  if (title.lenght <= title_limit || content.lenght <= content_limit) {
    return res.status(400).json({ error, message: " invalid parameters " });
  }

  models.User.findOne({
    where: { id: userId }
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "user not found", error });
      }
      if (req.file) {
        models.Post.create({
          title: title,
          content: content,
          imageURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
          UserId: user.id
        })
      } else {
        models.Post.create({
          title: title,
          content: content,
          UserId: user.id,
        })
      };
    })
    .then(() => res.status(201).json({ message: 'post created ! ' })
    )
    .catch(error => res.status(404).json({ error }));
};

//get all posts 
exports.getAllPost = (req, res, next) => {
  models.Post.findAll({
    include: [{
      model: models.User,
      attributes: ['username']
    }],
    order: [['createdAt', 'DESC']]
  })
    .then(posts => {
      if (!posts) {
        return res.status(404).json({ error: 'empty' })
      } else {
        return res.status(200).json({ posts })
      }
    })
    .catch(error => res.status(500).json({ error }))
};

// find one post

exports.getOnePost = (req, res, next) => {
  const id = req.params.id;
  models.Post.findOne({
    where: { id: id }
  })
    .then((post) => {
      if (post) {
        res.status(201).json({ message: post })
      }
      else {
        res.status(201).json({ message: null })
      }
    })
    .catch(error => res.status(500).json({ error }))
};


//update a post 
exports.modifyPost = (req, res, post) => {

  const id = req.params.id;
  const title = req.body.title;
  const content = req.body.content

  if (!req.body.title || !req.body.content) {
    return res.status(400).json({ error, message: "empty content!" });
  }

  models.Post.update(
    {
      title: title,
      content: content
    },
    { where: { id: id } }
  )
    .then(() => {
      res.status(200).json({ message: 'successfully updated' })
    })
    .catch(error => res.status(500).json({ error }));
};

//delete
exports.deletePost = (req, res, next) => {
  const currentUserId = req.body.currentUserId;
  const isAdmin = req.body.isAdmin;
  const id = req.params.id;



  console.log('isAdmin: ', isAdmin)
  console.log('currentUserId: ', currentUserId)
  models.Post.destroy({
    where: { id: id }
  })
    .then(() => {
      if (isAdmin || currentUserId == post.userId) {
        console.log(' autorise')
        res.status(200).json(
          { message: "successfully deleted! " });
      } else {
        console.log('pas autorise')
        res.status(401).json({ message: "Unauthorized to delete this comment" });
      };
    })
    .catch(error => res.status(500).json(
      { error })
    );
};
