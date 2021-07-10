
//Logique métier appliquées aux routes utilisateurs

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJs = require('crypto-js');
const models = require('../models');

//IV et key me permettent de crypter les email à l'inscription et à la connexion des utilisateurs

let key = cryptoJs.enc.Hex.parse(process.env.AES_KEY);
let iv = cryptoJs.enc.Hex.parse(process.env.AES_IV);

const checkMail = (mail) => {
  let regExpMail = new RegExp("^[0-9a-zA-Z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}");
  return regExpMail.test(mail);
};

const checkPassword = (password) => {
  let regExPassword = new RegExp("^[0-9a-zA-Z-+!*@%_]{8,15}");
  console.log('pwd: ', password);
  return regExPassword.test(password);
};

const checkUsername = (username) => {
  let regExpUsername = new RegExp("^[0-9a-zA-Z-@_]{4,10}");
  console.log('username: ', username);
  return regExpUsername.test(username);
};

//signup

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  if (email === null || username === null || password === null) {
    return res.status(400).json({ 'error': 'missing parameters' });
  }
  console.log('coucou');


  if (!checkMail(email)) {
    console.log(email);
    res.status(400).json({ message: "Veuillez saisir une adresse email valide" });
  }
  console.log(email);
  if (!checkPassword(password)) {
    res.status(400).json({ message: "Merci de saisir un mot de passe sécurisé : 8 caractères min, 15 caractères max, au moins : 1 minuscule, 1 majuscule, 1 chiffre, 1 caractère spécial" });
  }
  if (!checkUsername(username)) {
    res.status(400).json({ message: "please, enter a valid username" })
  }

  if (checkMail(email) === true && checkUsername(username) === true && checkPassword(password) === true) {

    models.User.findOne({
      where: { email: email } //on verifie dans la table User dans l'attribut email pour voir si le mail saisi dans le req n'existe pas déja dans la DB.
    })
      .then(user => {
        if (!user) {
          bcrypt.hash(password, 10)
            .then(hash => {
              const newUser = models.User.create({
                username: username,
                email: /*cryptoJs.AES.encrypt(email, key, { iv: iv }).toString()*/email,
                password: hash,
                isAdmin: false
              })
                .then(user => {
                  res.status(201).json({ message: ' new user created ! (userid : ' + user.id + ')' });
                })
                .catch(error => res.status(500).json({ message: "Probleme de compte", error: error }));
            });
        } else {
          return res.status(409).json({ 'error': 'user already exist ' });
        }
      })
      .catch(error => res.status(500).json({ error, error: error })); //requête qui s'effectue mal, on envoi une erreur pour dire qu'on ne peut pas verif si l'utilisateur existe ou pas. 
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
          return res.status(401).json({ error: 'user not found !' }); //401 = non autorisé
        }
        bcrypt.compare(password, user.password) //on compare le mdp utilisateur et le hash
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'wrong password !' });
            } else {
              res.status(200).json({
                userId: user.id,
                token: jwt.sign(
                  {
                    userId: user.id,
                    isAdmin: user.isAdmin
                  },
                  process.env.TOKEN,
                  { expiresIn: '24h' }
                )
              })
            }
          })
          .catch(error => res.status(500).json({ error })); //erreur server
      })
      .catch(error => res.status(500).json({ error }));
  } else {
    res.status(500).json({ error: 'Error with provided informations' });
  }
};

//renvoi l'utilisateur sélectionnée grace à son id

exports.getUserProfile = (req, res, next) => {

  const userId = req.body.id;
  models.User.findOne({
    // attributes: ['email', 'username'],
    where: { id: userId }
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "user not found", error });
      } else {
        res.status(200).json({ user })
      }
    })
    .catch(error => res.status(404).json({ message: "user not found ", error }));
};


//delete user
exports.deleteUser = (req, res, next) => {

  models.User.findOne({
    where: { id: req.body.id }
  })
    .then(user => {
      // //   console.log('tes1:', user.password);
      // console.log('user password', user.password);
      bcrypt.compare(req.body.password, user.password)

        .then(valid => {
          // console.log('coucou 2');
          if (!valid) {
            // console.log('pas pas ok')
            res.status(400).json({ error, message: "wrong password !" });
          } else {
            // console.log('pass ok')
            models.User.destroy({
              where: { id: req.body.id }
            })
              .then(() => {
                // console.log('test ici')
                res.status(200).json(
                  { message: 'logout successfully !' }
                );
              })
              .catch(error => {
                // console.log('error ', error);
                res.status(500).json({ error });
                // console.log('erreur a la suppression')
              })
          }
        })
        .catch(error => {

          // console.log('pass control error: ', error)
          res.status(500).json(error)
        }
        );
    })
    .catch(error => {
      // console.log('mauvais mot de passe: ', error)
      res.status(500).json({ error, message: 'erreur' })
    });
};
