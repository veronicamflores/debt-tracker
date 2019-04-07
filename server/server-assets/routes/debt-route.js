let router = require('express').Router()
let Debt = require('../models/Debt')


//EDIT
router.put('/:id', (req, res, next) => {
    Debt.findById(req.params.id)
        .then(debt => {
            if (!debt.authorId.equals(req.session.uid)) {
                return res.status(401).send("Not authorized")
            }
            debt.update(req.body, (err) => {
                if (err) {
                    console.log(err)
                    next()
                    return
                }
                res.send("debt updated")
            });
        })
        .catch(err => {
            console.log(err)
            next()
        })
})

//GET ALL LOGGED IN
router.get('/:id', (req, res, next) => {
    Debt.find({ authorId: req.params.id })
        .then(debt => {
            res.send(debt)
        })
        .catch(err => {
            res.status(400).send(err)
            next()
        })
})

//GET ONE
router.get('/:id', (req, res, next) => {
    Debt.findById(req.params.id)
        .then(debt => {
            res.send(debt)
        })
        .catch(err => {
            res.status(404).send(err)
            next()
        })
})


//POST
router.post('/', (req, res, next) => {
    req.body.authorId = req.session.uid
    req.body.created = Date.now()
    Debt.create(req.body)
        .then(newdebt => {
            res.send(newdebt)
        })
        .catch(err => {
            res.status(400).send(err)
            next()
        })
})

//DELETE
router.delete('/:id', (req, res, next) => {
    Debt.findById(req.params.id)
        .then(debt => {
            if (!debt.authorId.equals(req.session.uid)) {
                return res.status(401).send("Not authorized")
            }
            Debt.findByIdAndRemove(req.params.id)
                .then(data => {
                    res.send('Delorted!')
                })
        })
})

module.exports = router