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

  if (title.lenght === null && content.lenght === null) { //.trim à mettre en place pour éviter les espaces et les tab
    return res.status(400).json({ error, message: "please, fill in the blanks ! " });
  }

  if (title.lenght <= title_limit || content.lenght <= content_limit) {
    return res.status(400).json({ error, message: " invalid parameters " });
  }

  models.User.findOne({
    // attributes: ['email', 'username'],
    where: { id: userId }
  })
    .then((user) => {
      // console.log('ahah');
      if (!user) {
        // console.log('pooooooooooo');
        return res.status(404).json({ message: "user not found", error });
      }
      // console.log(user);
      if (req.file) {
        models.Post.create({
          title: title,
          content: content,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
          UserId: user.id
        })
      } else {
        models.Post.create({
          title: title,
          content: content,
          UserId: user.id
        })
      };
      // console.log('123');
    })
    .then(() => res.status(201).json({ message: 'post created ! ' })
    )
    .catch(error => res.status(404).json({ error }));

  /*A verifier : il est possible d'envoyer des messages meme quand le contenu et/ou le titre est vide 
  * renvoi une erreur 401 avec demande auth dans route.
  */
};

//get all posts a revoir

exports.getAllPost = (req, res, next) => {
  console.log('coucou');
  models.Post.findAll({
    include: [{
      model: models.User,
      attributes: ['username']
    }],
    order: [['createdAt', 'DESC']]
  })
    .then(posts => {
      console.log(posts);
      if (!posts) {
        console.log('ici');
        return res.status(404).json({ error: 'empty' })
      } else {
        console.log('et la');
        return res.status(200).json({ posts })
      }
    })
    .catch(error => res.status(500).json({ error }))
};

// find one post

exports.getOnePost = (req, res, next) => {
  const id = (req.body.id);
  models.Post.findOne({
    where: { id: id }
  })
    .then((post) => {
      console.log(id);
      if (post) {
        res.status(201).json({ message: post })
      }
    })
    .catch(error => res.status(500).json({ error }))
};


//update a post 
//TODO = .trim

exports.modifyPost = (req, res, post) => {

  const id = req.body.id;
  const title = req.body.title;
  const content = req.body.content

  if (!req.body.title || !req.body.content) {
    return res.status(400).json({ error: "empty content!" });
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


//delete a retravailler (voir pour admin)
exports.deletePost = (req, res, next) => {
  const id = req.params.id;

  //bouchon
  const isAdmin = false; /* ex: localstorage.curentUser.isAdmin */
  const currentUser = 1; /* ex: localstorage.curentUser.id */

  models.Post.destroy({
    where: { id: id }
  })
    .then(() =>
      res.status(200).json(
        { message: "successfully deleted! " })
    )
    .catch(error => res.status(500).json(
      { error })
    );
};
