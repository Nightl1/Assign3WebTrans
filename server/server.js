require('dotenv').config(); // load the .env variables

const express = require('express')
const app = express()
const cors = require('cors');
const morgan = require('morgan');
const { connect } = require('./database/database');


// Below is the imports of routes. PS: This doesnt USE the route. Middleware does that.
const authRoute = require('./routes/auth');


// Below were things already there
app.use(cors());
app.use(morgan('tiny')); // loger
app.use(express.json()); // body-parcer

// import the client build here. From client folder to here.

// Middleware for routes below
app.use('/', authRoute)
// app.get('/', function(req, res) {
//     res.send('Hello World')
// })

const port = process.env.PORT || 8080;
app.listen(port, () => {
    connect()
    console.log("Server listening on port " + port)
})