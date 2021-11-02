const router = require('express').Router()

const model = require("./accounts-model")
const middleware = require("./accounts-middleware");

router.get('/', (req, res) => {
  model.getAll().then(accounts => res.status(200).json(accounts))
    .catch(err => res.status(500).json({message:"error getting all accounts", error:err}))
})

router.get('/:id', middleware.checkAccountId, (req, res) => {
  res.status(200).json(req.account);
})

router.post('/', middleware.checkAccountPayload, middleware.checkAccountNameUnique, (req, res) => {
  model.create(req.payload)
    .then(idArray => 
      model.getById(idArray[0]).then(account => res.status(201).json(account))
        .catch(err => res.status(201).json({message:"post created but error returning account", error:err}))
    )
    .catch(err => res.status(500).json({message:"error creating account", error:err}));
})

router.put('/:id', middleware.checkAccountId, middleware.checkAccountPayload, middleware.checkAccountNameUnique, (req, res) => {
  model.updateById(req.params.id, req.body)
    .then(() => {
      model.getById(req.params.id).then(account => res.status(200).json(account))
        .catch(err => res.status(200).json({message:"post updated but error returning account", error:err}))
    })
    .catch(err => res.status(500).json({message:"error updating account", error:err}))
})

router.delete('/:id', middleware.checkAccountId, (req, res) => {
  model.deleteById(req.account.id).then(() => res.status(200).json(req.account))
    .catch(err => res.status(500).json({message:"error deleting account", error:err}))
})

router.use((err, req, res, next) => { // eslint-disable-line
  next();
})

module.exports = router;