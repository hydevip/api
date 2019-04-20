const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.users_post_register = (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'User already exists'
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          }
          else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              password: hash
            });

            user.save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'User Created!'
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
              });

          }

        }
        );

        
      }
    });
};

exports.users_post_login = (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Login failed.'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Login failed.'
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              username: user[0].username,
              userId: user[0]._id
            },
            process.env.SECRET,
            {
              expiresIn: "4h"
            }
          );

          return res.status(200).json({
            message: 'Login successful!',
            token: token
          });
        }
        return res.status(401).json({
          message: 'Login failed.'
        });

      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });

};


exports.users_delete_userById =  (req, res, next) => {
  const id = req.params.userId;
  User.remove({ _id: id }).exec()
    .then(result => {
      res.status(200).json({
        message: 'User deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });

};