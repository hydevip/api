const Customer = require('../models/customer');
const mongoose = require('mongoose');
//Though this api will technically work, too much boilerplate for my taste. Can you shorten it by using functions (as in the CLI)?
exports.customers_get_all = (req, res, next) => {
  Customer.find()
    .select('name email phone')
    .exec()
    .then(customers => {
      console.log(customers);
      res.status(200).json(customers);
    })
    .catch(err=>handleError(res,err));
};


exports.customers_create_customer = (req, res, next) => {
  getCustomerFromRequest(req).save()
    .then(result => {
      console.log(result);

      res.status(201).json({
        message: 'Customer was created',
        createdCustomer: result
      });
    })
    .catch(err=>handleError(res,err));
};

exports.customers_get_customerByName = (req, res, next) => {
  let nameStr = req.params.customerName;
  Customer.find({ name: { $regex: '.*'+ nameStr +'.*' } })
    .select('name email phone')
    .exec()
    .then(handleGetCustByNameFromDb(res, req))
    .catch(err=>handleError(res,err));
};

exports.customer_delete_customerById = (req, res, next) => {
  const id = req.params.customerId;
  Customer.remove({ _id: id }).exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err=>handleError(res,err));
};


exports.customers_update_customerById = (req, res, next) => {
  const id = req.params.customerId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Customer.update({ _id: id }, { $set: updateOps })
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err=>handleError(res,err));
};

function getCustomerFromRequest(req) {
  return new Customer({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  });
}

function handleGetCustByNameFromDb(res, req) {
  return cust => {
    console.log(cust);
    if (cust) {
      res.status(200).json(cust);
    }
    else {
      res.status(404).json({ message: 'There is no customer name to contain' + req.params.customerName });
    }
  };
}

function handleError(res,err) {
  //return err => {
    console.log(err);
    res.status(500).json({ error: err });
  //};
}
