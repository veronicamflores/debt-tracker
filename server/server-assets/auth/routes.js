
let router = require('express').Router();
let Users = require('../models/User');
let session = require('./session')

//NEVER TELL USERS WHICH FAILED
let loginError = new Error('Bad Username or Password')

//CREATE A NEW USER
router.post('/auth/register', (req, res) => {
    //VALIDATE PASSWORD LENGTH
    if (req.body.password.length < 5) {
        return res.status(400).send({
            error: 'Password must be at least 6 characters'
        })
    }
    //CHANGE THE PASSWORD TO A HASHED PASSWORD
    // @ts-ignore
    req.body.password = Users.generateHash(req.body.password)
    //CREATE THE USER
    Users.create(req.body)
        .then(user => {
            //REMOVE THE PASSWORD BEFORE RETURNING
            delete user._doc.password
            //SET THE SESSION UID (SHORT FOR USERID)
            req.session.uid = user._id
            res.send(user)
        })
        .catch(err => {
            res.status(400).send(err)
        })
})

router.post('/auth/login', (req, res) => {
    //FIND A USER BASED ON PROVIDED EMAIL
    Users.findOne({
        username: req.body.username
    })
        .then(user => {
            if (!user) {
                return res.status(400).send(loginError)
            }
            //CHECK THE PASSWORD
            if (!user.validatePassword(req.body.password)) {
                return res.status(400).send(loginError)
            }
            //ALWAYS REMOVE THE PASSWORD FROM THE USER OBJECT
            delete user._doc.password
            req.session.uid = user._id
            res.send(user)
        }).catch(err => {
            res.status(400).send(loginError)
        })
})

//REMOVE THE ACTIVE SESSION FROM THE DATABASE
router.delete('/auth/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send(err)
        }
        return res.send({
            message: 'Logout Successful'
        })
    })
})


//Validates req.session.uid
router.get('/auth/authenticate', (req, res) => {
    Users.findById(req.session.uid)
        .then(user => {
            if (!user) {
                return res.status(401).send({
                    error: 'Please login to continue'
                })
            }
            delete user._doc.password
            res.send(user)
        }).catch(err => {
            res.status(500).send(err)
        })
})

//Change User Profile Info
router.put('/auth/:id', (req, res, next) => {
    Users.findById(req.params.id)
        .then(user => {
            if (!user._id.equals(req.session.uid)) {
                return res.status(401).send('Not your profile, yo')
            }
            user.update(req.body, (err) => {
                if (err) {
                    console.log(err)
                    next()
                    return
                }
                res.send("Profile updated")
            });
        })
        .catch(err => {
            console.log(err)
            next()
        })
})

router.get('/auth/:id', (req, res, next) => {
    Users.findById(req.params.id)
        .then(user => {
            if (!user._id.equals(req.session.uid)) {
                return res.status(401).send("something is off??")
            }
            delete user._doc.password
            res.send(user)
        })
        .catch(err => {
            console.log(err)
            next()
        })
})


module.exports = {
    router,
    session
}