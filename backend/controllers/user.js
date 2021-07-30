
//Logique métier appliquées aux routes utilisateurs

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');

//contrôle
const checkMail = (mail) => {
  let regExpMail = new RegExp("^[0-9a-zA-Z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}");
  return regExpMail.test(mail);
};

const checkPassword = (password) => {
  let regExPassword = new RegExp("^[0-9a-zA-Z-+!*@%_]{8,15}");
  return regExPassword.test(password);
};

const checkUsername = (username) => {
  let regExpUsername = new RegExp("^[0-9a-zA-Z-@_]{2,10}");
  return regExpUsername.test(username);
};


//signup
exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin;

  if (email === null || username === null || password === null) {
    res.status(400).json({ message: "Error, missing parameters" });
  }


  if (!checkMail(email)) {
    res.status(400).json({ message: "Please, enter a valid password" });
  }
  if (!checkPassword(password)) {
    res.status(400).json({ message: "Your password must contain at least: 8 characters, one number, and includes both lower and uppercase letters and special characters" });
  }
  if (!checkUsername(username)) {
    res.status(400).json({ message: "please, enter a valid username" })
  }

  if (checkMail(email) === true && checkUsername(username) === true && checkPassword(password) === true) {

    models.User.findOne({
      where: { username: username }
    })
      .then(user => {
        if (!user) {
          bcrypt.hash(password, 10)
            .then(hash => {
              const newUser = models.User.create({
                username: username,
                email: email,
                password: hash,
                isAdmin: isAdmin || false
              })
                .then(user => {
                  res.status(201).json({ message: ' new user created ! (userid : ' + user.id + ')' });
                })
                .catch(error => res.status(500).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
        } else {
          return res.status(409).json({ error: 'user already exist' });
        }
      })
      .catch(error => res.status(401).json({ error }));
  } else {
    res.status(500).json({ error: 'Error with provided informations' });
  }
};


//login
exports.login = (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username === null || password === null) {
    return res.status(400).json({ 'error': 'missing parameters' });
  }

  if (checkUsername(username) === true && checkPassword(password) === true) {

    models.User.findOne({
      where: { username: username }
    })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'user not found !' });
        }
        //on compare le mdp utilisateur et le hash
        bcrypt.compare(password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Wrong password. please try again' });
            } else {

              res.status(200).json({
                userId: user.id,
                token: jwt.sign(
                  {
                    userId: user.id,
                    isAdmin: user.isAdmin
                  },
                  process.env.TOKEN,
                  { expiresIn: '730h' }
                )
              });
            };
          })
          .catch(error => res.status(401).json({ error, message: 'Unauthorized' }));
      })
      .catch(error => res.status(500).json({ error }));
  } else {
    res.status(500).json({ error: 'Error with provided informations' });
  }
};


/**
 * GET : Permet d'afficher 1 utilisateur
 * renvoi l'utilisateur sélectionnée grace à son id
*/

exports.getUserProfile = (req, res, next) => {

  const id = req.params.id;

  models.User.findOne({
    where: { id: id }
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User Not Found", error });
      } else {
        res.status(200).json({ user })
      }
    })
    .catch(error => res.status(500).json({ error }));
};


/**
 * PUT : Permet la modification du MDP
 * On retrouve le user par son id 
*/
exports.updateUser = (req, res, next) => {
  const id = req.params.id;
  const newPassword = req.body.newPassword;
  const password = req.body.password;

  if (checkPassword(newPassword)) {
    models.User.findOne({
      attributes: ['id', "password"],
      where: { id: id }
    })
      .then((user) => {

        bcrypt.compare(password, user.password, function (err, result) {

          if (result) {

            bcrypt.compare(newPassword, user.password, function (err, result) {

              if (!result) {

                bcrypt.hash(newPassword, 10)
                  .then(hash => {

                    let values = {
                      password: hash
                    };
                    let condition = {
                      where: { id: id }
                    }

                    models.User.update(values, condition)
                      .then(result => {
                        res.status(201).json({ message: result + ' data updated' })
                      })
                      .catch(error => res.status(500).json({ error }))
                  })
              } else {
                res.status(400).json({ message: "Same password: you cannot have same password as above !", code: "413" })
              };
            })
          }
          else {
            res.status(400).json({ message: "Wrong Password, please try again", code: "412" })
          }
        });
      })
      .catch(error => res.status(404).json({ message: "User not found", error }))
  } else {
    res.status(400).json({ message: "Wrong password", error })
  }
};


/*
* delete user
* requete (id, mdp);
* On cherche l'utilisateur
* on compare son mdp à celui passé dans la req
* si ok => on recupère l'utilisateur a supp dans la table user
* puis suppression. 
*/
exports.deleteUser = (req, res, next) => {
  models.User.findOne({
    where: { id: req.params.id }
  }).then(user => {

    bcrypt.compare(req.body.password, user.password).then(valid => {
      if (valid) {
        models.Comment.destroy({
          where: { userId: req.params.id }
        }).catch(error => {
          res.status(500).json({ error });
        })

        models.Post.destroy({
          where: { userId: req.params.id }
        }).catch(error => {
          res.status(500).json({ error });
        })

        models.User.destroy({
          where: { id: req.params.id }
        }).catch(error => {
          res.status(500).json({ error });
        })

        res.status(200).json({ message: "Delete done !" })
      } else {
        res.status(400).json({ message: "wrong password !", code: "414" });
      }
    })
  }).catch(error => {
    res.status(500).json({ error })
  });
};
