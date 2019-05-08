const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { handleError } = require('../errHandling');
const { dbFindByUsername, createUserByUsernameAndHash } = require('../dbService');


exports.users_post_register = (req, res, next) => {
  dbFindByUsername( req.body.username)
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'User already exists'
        });
      } else {
        handleUserRegister(req, res);
      }
    });
};

exports.users_post_login = (req, res, next) => {
  dbFindByUsername( req.body.username)
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Login failed.'
        });
      }
      handleUserLogin(req, user, res);
    })
    .catch(err => handleError(res, err));
};


exports.users_delete_userById =  (req, res, next) => {
  dbRemoveUserById(req.params.userId)
    .then(result => {
      res.status(200).json({
        message: 'User deleted'
      });
    })
    .catch(err => handleError(res, err));

};

function handleUserRegister(req, res) {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err
      });
    }
    else {
      createUserByUsernameAndHash(req, hash)
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: 'User Created!'
          });
        })
        .catch(err => handleError(res, err));
    }
  });
}


function handleUserLogin(req, user, res) {
  bcrypt.compare(req.body.password, user[0].password, (err, result) => {
    if (err) {
      return res.status(401).json({
        message: 'Login failed.'
      });
    }
    if (result) {
      const token = jwt.sign({
        username: user[0].username,
        userId: user[0]._id
      }, process.env.SECRET, {
          expiresIn: "4h"
        });
      return res.status(200).json({
        message: 'Login successful!',
        token: token
      });
    }
    return res.status(401).json({
      message: 'Login failed.'
    });
  });
}
