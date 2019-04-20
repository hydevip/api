const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');






const app = express();

app.use(cors());

const usersRoutes = require('./api/routes/users');
const customerRoutes = require('./api/routes/customers');


mongoose.set('useCreateIndex', true);

mongoose.connect('mongodb+srv://restdbUsername:' + process.env.DB_PASS + '@cluster0-fnckg.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use('/', (req,res,next)=>{
  res.status(200).json({
    message: 'welcome to krizo backend'
  });
});
app.use('/users', usersRoutes);
app.use('/customers', customerRoutes);



app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });

});



app.listen(process.env.PORT || 8080, () => {
  console.log('server started');
});