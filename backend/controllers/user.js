
//Logique métier appliquées aux routes utilisateurs

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const cryptoJs = require('crypto-js');
const models = require('../models');

//IV et key me permettent de crypter les email à l'inscription et à la connexion des utilisateurs

// let key = cryptoJs.enc.Hex.parse(process.env.AES_KEY);
// let iv = cryptoJs.enc.Hex.parse(process.env.AES_IV);

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
  const isAdmin = req.body.isAdmin;

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
                isAdmin: isAdmin || false
              })
                .then(user => {
                  res.status(201).json({ message: ' new user created ! (userid : ' + user.id + ')' });
                })
                .catch(error => res.status(500).json({ message: "Probleme de compte", error: error }));
            })
            .catch(error => res.status(500).json({ message: "Probleme de compte", error: error }));
        } else {
          return res.status(409).json({ 'error': 'user already exist ' });
        }
      })
      .catch(error => res.status(500).json({ error })); //requête qui s'effectue mal, on envoi une erreur pour dire qu'on ne peut pas verif si l'utilisateur existe ou pas. 
  } else {
    res.status(500).json({ error: 'Error with provided informations' });
  }
};

//login

exports.login = (req, res, next) => {
  // const email = req.body.email;
  // const userId = req.params.id
  const username = req.body.username;
  const password = req.body.password;
  // const encryptedEmail = cryptoJs.AES.encrypt(email, key, { iv: iv }).toString();

  if (username === null || password === null /*|| email === null*/) {
    return res.status(400).json({ 'error': 'missing parameters' });
  }

  if (checkUsername(username) === true /*&& checkMail(email) === true*/ && checkPassword(password) === true) {

    models.User.findOne({
      where: { username: username/*, email: encryptedEmail*/ }
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

              // console.log('user: ', user)
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
          .catch(error => res.status(500).json({ error })); //erreur server
      })
      .catch(error => res.status(500).json({ error }));
  } else {
    res.status(500).json({ error: 'Error with provided informations' });
  }
};


//renvoi l'utilisateur sélectionnée grace à son id

exports.getUserProfile = (req, res, next) => {

  // const username = req.params.username;
  const id = req.params.id;

  models.User.findOne({
    // attributes: ['username', 'email'],
    where: { id: id }
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

// update profile

exports.updateUser = (req, res, next) => {
  const id = req.params.id;
  const newPassword = req.body.newPassword;
  const password = req.body.password;

  console.log('A:', newPassword);

  if (checkPassword(newPassword)) {
    models.User.findOne({
      attributes: ['id', "password"],
      where: { id: id }
    })
      .then((user) => {
        //       console.log('oldPass:', password);
        console.log('user2:', user);
        console.log('newPassword:', newPassword)
        // console.log('password:', password)
        // console.log('pass user: ', user.password)
        // let samePassword = newPassword === user.password;
        // let samePassword;
        //test
        bcrypt.compare(password, user.password, function (err, result) {

          if (result) {
            console.log('result : ', result)
            //     // checkNewPassword(newPassword, user)

            bcrypt.compare(newPassword, user.password, function (err, result) {
              //       console.log('result2: ', result)


              if (!result) {

                console.log('pas le meme mdp')
                bcrypt.hash(newPassword, 10)
                  .then(hash => {
                    console.log('id: ', id)

                    let values = {
                      password: hash,
                      // username: req.body.username,
                      // isAdmin: req.body.isAdmin,

                    };

                    let condition = {
                      where: { id: id }
                    }

                    models.User.update(values, condition)
                      .then(result => {
                        console.log('result')
                        res.status(201).json({ message: result + ' data updated' })
                      })
                      .catch(error => res.status(500).json({ error }))
                  })
                console.log('pass: ', newPassword)
              } else {
                console.log('meme mdp')
                res.status(400).json({ message: "same password: you cannot have same password as above !" })
              };
            })

          }
          else {
            res.status(400).json({ message: "mauvais mdp" })
          }

          // }
          // else {
          //   console.log('ds else')
          // }
        });
        //fin
        // bcrypt.compare(newPassword, user.password, function (err, result) {
        //   console.log('result: ', result)


        //   if (!result) {

        //     console.log('pas le meme mdp')
        //     bcrypt.hash(newPassword, 10)
        //       .then(hash => {
        //         console.log('id: ', id)

        //         let values = {
        //           password: hash,
        //           // username: req.body.username,
        //           // isAdmin: req.body.isAdmin,

        //         };

        //         let condition = {
        //           where: { id: id }
        //         }

        //         models.User.update(values, condition)
        //           .then(result => {
        //             console.log('result')
        //             res.status(201).json({ message: result + ' data updated' })
        //           })
        //           .catch(error => res.status(500).json({ error }))
        //       })
        //     console.log('pass: ', newPassword)
        //   } else {
        //     console.log('meme mdp')
        //     res.status(400).json({ message: "same password: you cannot have same password as above !" })
        //   };
        // })
        //fin test
        // console.log('samePassword out: ', samePassword)

      })
      .catch(error => res.status(404).json({ message: "user not found", error }))
  }
  else {
    res.status(400).json({ message: "wrong password", error })
  }
};


//delete user

/*
* requete (id, mdp);
* On cherche l'utilisateur
* on compare son mdp à celui passé dans la req
* si ok => on recupère l'utilisateur a supp dans la table user
* puis suppression. 
*/
exports.deleteUser = (req, res, next) => {

  console.log('id: ', req.params.id)
  models.User.findOne({
    where: { id: req.params.id }
  })
    .then(user => {
      console.log('tes1:', user.password);
      bcrypt.compare(req.body.password, user.password)

        .then(valid => {
          if (!valid) {
            res.status(400).json({ error, message: "wrong password !" });
          } else {
            models.User.destroy({
              where: { id: req.params.id }
            })
              .then(() => {
                res.status(200).json(
                  { message: 'delete successfully !' }
                );
              })
              .catch(error => {
                res.status(500).json({ error });
                console.log('erreur a la suppression')
              })
          }
        })
        .catch(error => {
          res.status(400).json({ message: "pass control error", error })
        }
        );
    })
    .catch(error => {

      res.status(500).json({ error })
    });
};

// function checkNewPassword(newPassword, user) {
//   bcrypt.compare(newPassword, user.password, function (err, result) {
//     console.log('result2: ', result)


//     if (!result) {

//       console.log('pas le meme mdp')
//       bcrypt.hash(newPassword, 10)
//         .then(hash => {
//           console.log('id: ', id)

//           let values = {
//             password: hash,
//             // username: req.body.username,
//             // isAdmin: req.body.isAdmin,

//           };

//           let condition = {
//             where: { id: id }
//           }

//           models.User.update(values, condition)
//             .then(result => {
//               console.log('result')
//               res.status(201).json({ message: result + ' data updated' })
//             })
//             .catch(error => res.status(500).json({ error }))
//         })
//       console.log('pass: ', newPassword)
//     } else {
//       console.log('meme mdp')
//       res.status(400).json({ message: "same password: you cannot have same password as above !" })
//     };
//   })
// }