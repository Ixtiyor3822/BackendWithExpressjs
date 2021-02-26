const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../routes/models/user');



router.post('/register', (req, res, next) => {

    User.find({ email: req.body.email })
        .exec()
        .then(doc => {
            if (doc.length >= 1) {
                res.status(409).json({
                    message: 'User allaqachon ro`yhatdan o`tgan'
                });
            } else {
                bcrypt.hash(req.body.password, 7, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                })
            }
        })

})

router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(result => {
            if (!result.email) {
                return res.status(401).json({
                    message: 'Email yoki Parol hato'
                });
            }
            bcrypt.compare(req.body.password, result.password, (err, user) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Email yoki Parol hato'
                    })
                }
                if (user) {

                    const token = jwt.sign({
                        email: user.email,
                        _id: user._id,
                    },
                        'tokencha',
                        {
                            expiresIn: '1h'
                        })

                    return res.status(200).json({

                        message: 'Tizimga yo`naltirilayapdi.',
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Hato'
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {

            res.status(500).json({
                error: err
            })
        })
})

module.exports = router;