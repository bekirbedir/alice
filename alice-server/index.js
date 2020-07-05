const db = require("./db")();
const express = require("express");
const app = express();
var path = require('path');
var bodyParser = require('body-parser')
var auhtguard=require('./Controllers/user.authguard')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const usersRouter = require("./Controllers/user.controller");
var router = express.Router(); 
app.use('/users/',auhtguard, usersRouter);




const port= process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`localhost:${port} -> api working !!! `);
});

module.exports = app;






