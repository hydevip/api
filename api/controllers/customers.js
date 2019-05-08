const { dbFindAllCustomers, dbFindCustomerByName, dbRemoveCustomerById, dbUpdateCustomerById, dbCreatedNewCustomer } = require('../dbService');
const { handleError } = require('../errHandling');
//Though this api will technically work, too much boilerplate for my taste. Can you shorten it by using functions (as in the CLI)?
//Mikkel:ok there's a slight problem with how you, from a code reuse point of view, are structuring this.
//imagine that other parts of the project are using the functions, how can you call it?
//you functions and queries are all tangled together, they expect a req and a resp, but you need to use them
// in some other context where there is neither  request or response available, how will you use them ?
//you would have no choice but to type your customer.find().select().exec().once again, which is a mess and could be a problem if
//the query for some reason needs to be changed..you would have to do it everywhere!
//I propose that you make a new file "api" or something like that, put your functions, "customers get all etc" there, and call them from the
//your web context. These functions will not receive a req or response, in fact they dont even know the are in a web api, but will only receive
//and return values that are relevant for their task.
//the trick is to isolate things that have nothing to do with each other..both for clarity but also to make the code much more easy to maintain in the future.

exports.customers_get_all = (req, res, next) => {
  dbFindAllCustomers()
    .then(customers => {
      console.log(customers);
      res.status(200).json(customers);
    })
    .catch(err => handleError(res, err));//Mikkel: a step in the right direction, bravo!!
};

exports.customers_create_customer = (req, res, next) => {
  createCustomerInDbFromRequest(req)
    .then(result => {
      console.log(result);

      res.status(201).json({
        message: 'Customer was created',
        createdCustomer: result
      });
    })
    .catch(err => handleError(res, err));
};

exports.customers_get_customerByName = (req, res, next) => {
  let nameStr = req.params.customerName;
  dbFindCustomerByName(nameStr)
    .then(handleGetCustByNameFromDb(res, req))
    .catch(err => handleError(res, err));
};

exports.customer_delete_customerById = (req, res, next) => {
  const id = req.params.customerId;
  dbRemoveCustomerById(id)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => handleError(res, err));
};


exports.customers_update_customerById = (req, res, next) => {
  const id = req.params.customerId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  dbUpdateCustomerById(id, updateOps)
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => handleError(res, err));
};

//good!!
function createCustomerInDbFromRequest(req) {
  return dbCreatedNewCustomer(req.body.name, req.body.email, req.body.phone);
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
