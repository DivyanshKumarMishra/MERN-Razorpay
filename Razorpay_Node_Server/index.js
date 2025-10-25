const express = require('express');
const cookie_parser = require('cookie-parser');
const cors = require('cors');
const orderRouter = require('./routes/orderRouter');
const connectToDB = require('./db_config');
const paymentRouter = require('./routes/paymentRouter');
require('colors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PATH', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// app.use((req, res, next) => {
//   next();
// });

app.use('/api/orders', orderRouter);
app.use('/api/payments', paymentRouter);

async function runServer() {
  try {
    app.listen(port, async () => {
      const mongo = await connectToDB();
      if (mongo) {
        console.log('Connected to Mongo Database'.cyan);
        console.log(`Server is running on port:`.cyan, port.red);
        console.log(`Node Environment:`.cyan, process.env.NODE_ENV.red);
      }
    });
  } catch (error) {
    console.log('Failed to start server', error.message);
  }
}

runServer();
