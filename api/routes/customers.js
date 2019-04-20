const express = require('express');
const router = express.Router();
const checkLogin = require('../middleware/check-login');
const CustomersController = require('../controllers/customers');

router.get('/', checkLogin , CustomersController.customers_get_all);

router.post('/', checkLogin, CustomersController.customers_create_customer);

router.get('/:customerId', checkLogin, CustomersController.customers_get_customerById);

router.delete('/:customerId', checkLogin, CustomersController.customer_delete_customerById );

router.patch('/:customerId', CustomersController.customers_update_customerById);

module.exports = router;