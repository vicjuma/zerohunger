const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/users/farmers');
const router = express.Router();

router.post('/signup', (req, res, next) => {
  User.find({email: req.body.email})
    .exec()
      .then((user) => {
        if(user.length >= 1){
          return res.status(409).json('user already exists')
        }else{
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return new Error('there was a problem hashing the password');
            }else{
              const user = new User({
                _id: new mongoose.Types.ObjectId,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                nationalId: req.body.nationalId,
                email: req.body.email,
                password: hash
              });
              user.save()
            .then((result) => {
              res.status(201).json({
                message: "user created successfully",
                user: result
              });
            }).catch((err) => {
              res.status(401).json({err});
            });
            }
          });
        }
      }).catch(err => res.status(500).json({err}));
  // creating a new user
});

router.post('/login', (req, res, next) => {
  User.find({email: req.body.email})
    .exec()
      .then((user) => {
        if(!user){
          return res.status(404).send('unauthorized access');
        }
        bcrypt.compare(req.body.password, user[0].password, (err, valid) => {
          if(err){
            return res.status(404).json({message: 'unauthorized access'});
          }
          if(valid){
            token = jwt.sign({
              email: user[0].email,
              id: user[0]._id
            }, 'mynameisvictorjuma', {
              expiresIn: '1h'
            });
            return res.status(200).json({
              message: 'authorized access',
              token: token
            });
          }
        });
      })
        .catch(err => res.json({err}));
        // next();
});

router.get('/', (req,res,next) => {
  const id = req.body._id
  User.find({id:id})
      .exec()
        .then((result) => {
          res.status(200).send(result);
        }).catch((err) => {
          res.status(500).json({err});
        });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  User.remove({_id: id})
    .exec()
      .then((result) => res.send(result))
        .catch(err => res.send(err));
});

module.exports = router;