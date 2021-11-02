const db = require("../../data/db-config");

const getAll = () => {
  return db("accounts") // returns an array of account objects
}

const getById = id => {
  return db("accounts").where({ id }).first(); //returns an account object
}

const create = account => {
  return db("accounts").insert(account); // returns an id array
}

const updateById = (id, account) => {
  return db("accounts").where({ id }).update(account); // returns 1
}

const deleteById = id => {
  return db("accounts").where({ id }).delete(); // returns 1
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
}
