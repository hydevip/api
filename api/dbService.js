const mongoose = require('mongoose');
const Customer = require('../models/customer');
const User = require('../models/user');
//real good!

function dbConnect() {
    return mongoose.connect('mongodb+srv://restdbUsername:' + process.env.DB_PASS + '@cluster0-fnckg.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });
}

function dbUpdateCustomerById(id, updateOps) {
    return Customer.update({ _id: id }, { $set: updateOps });
}

function dbRemoveCustomerById(id) {
    return Customer.remove({ _id: id }).exec();
}

function dbFindCustomerByName(nameStr) {
    return Customer.find({ name: { $regex: '.*' + nameStr + '.*' } })
        .select('name email phone')
        .exec();
}

function dbFindAllCustomers() {
    return Customer.find()
        .select('name email phone')
        .exec();
}

function dbCreatedNewCustomer(name, email, phone) {
  return new Customer({
    _id: new mongoose.Types.ObjectId(),
    name: name,
    email: email,
    phone: phone
  }).save();
}

//for user DB 

function dbFindByUsername(username) {
    return User.find({ username: username })
        .exec();
}

function dbRemoveUserById(id) {
    return User.remove({ _id: id }).exec();
}

function createUserByUsernameAndHash(req, hash) {
    return buildUserForDb(req.body.username, hash).save();
  }
  
  function buildUserForDb(username, hash) {
    return new User({
      _id: new mongoose.Types.ObjectId(),
      username: username,
      password: hash
    });
  }


module.exports = { dbConnect, dbFindAllCustomers, dbFindCustomerByName, dbRemoveCustomerById, dbUpdateCustomerById, dbBuildNewCustomer: dbCreatedNewCustomer,
     dbFindByUsername, dbRemoveUserById, createUserByUsernameAndHash };