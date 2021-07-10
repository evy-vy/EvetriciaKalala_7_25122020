const models = require('../models');
const fs = require('fs');
const jwt = require('jsonwebtoken');


const title_limit = 2;
const content_limit = 4;


//routes 

//create post

exports.createPost = (req, res, next) => {

  if (!req.body.title && !req.body.content) {
    return res.status(400).json({ error, message: "please, fill in the blanks ! " });
  }

  models.User.findOne({
    // attributes: ['email', 'username'],
    where: { id: req.body.id }
  })
    .then((user) => {
      console.log('ahah');
      if (!user) {
        console.log('pooooooooooo');
        return res.status(404).json({ message: "user not found", error });
      }

      console.log(user);
      if (req.file) {
        models.Post.create({
          title: req.body.title,
          content: req.body.content,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        })
      } else {


        models.Post.create({
          title: req.body.title,
          content: req.body.content,
          likes: 0,
          UserId: user.id
        })
      };
      console.log('123');
    })
    .then(() => res.send('post'))
    .then(() => res.status(201).json({ message: 'post created ! ' }))
    .catch(error => res.status(404).json({ message: "authentification error ", error }));
};

