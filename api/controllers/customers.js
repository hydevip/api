const Customer = require('../models/customer');
const mongoose = require('mongoose');

exports.customers_get_all = (req, res, next) => {
  Customer.find()
    .select('name email phone')
    .exec()
    .then(customers => {
      console.log(customers);
      res.status(200).json(customers);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });

};


exports.customers_create_customer = (req, res, next) => {

  const customer = new Customer({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  });

  customer.save()
    .then(result => {
      console.log(result);

      res.status(201).json({
        message: 'Customer was created',
        createdCustomer: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });

};



exports.customers_get_customerByName = (req, res, next) => {
  let nameStr = req.params.customerName;
  Customer.find({ name: { $in: '/'+ nameStr +'/' } })
    .select('name email phone')
    .exec()
    .then(cust => {
      console.log(cust);
      if (cust) {
        res.status(200).json(cust);
      }
      else {
        res.status(404).json({ message: 'There is no customer name to contain' + req.params.customerName });
      }

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.customer_delete_customerById = (req, res, next) => {
  const id = req.params.customerId;
  Customer.remove({ _id: id }).exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });

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
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });

};