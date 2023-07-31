const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');

const keys = require('./config/keys');
const hospitalRoutes = require('./routes/hospital');
const receiverRoutes = require('./routes/receiver');
const publicRoutes = require('./routes/public');

const app = express();

app.use(helmet());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/hospital', hospitalRoutes);
app.use('/receiver', receiverRoutes);
app.use('/public', publicRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({
    message: message,
    data: data,
  });
});

const MONGODB_URI = keys.mongoURI;

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log('Connected to Database');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`BloodBank Rest-API listening on port : ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
