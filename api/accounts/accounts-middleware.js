const model = require("./accounts-model");

exports.checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body;
  const budgetExists = budget!==undefined;

  if(!name||!budgetExists){
    res.status(400).json({ message: "name and budget are required" });
  } else if(typeof name !== "string") {
    res.status(400).json({ message: "name of account must be a string" });
  } else if(name.trim().length<3||name.trim().length>100){
    res.status(400).json({ message: "name of account must be between 3 and 100" });
  } else if(typeof budget !== "number"){
    res.status(400).json({ message: "budget of account must be a number" });
  } else if(budget<0||budget>1000000){
    res.status(400).json({ message: "budget of account is too large or too small" });
  } else {
    req.payload = { name: name.trim(), budget };
    next();
  }
}

exports.checkAccountNameUnique = (req, res, next) => {
  const name = req.body.name.trim();
  model.getAll()
    .then(accounts => req.method==="put" ? accounts.filter(({id}) => req.params.id!==id) : accounts)
    .then(accounts => accounts.reduce((acc, account) => acc&&account.name!==name, true))
    .then(bool => bool ? next() : res.status(400).json({ message: "that name is taken" }))
    .catch(err => res.status(500).json({message:"Error getting all users", error:err}))
}

exports.checkAccountId = (req, res, next) => {
  const { id } = req.params;
  model.getById(id)
    .then(account => {
      if(account){
        req.account=account;
        next();
      } else res.status(404).json({ message: "account not found" });
    })
    .catch(err => res.status(500).json({message:"error getting user", error:err}))
}
