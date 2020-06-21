const db = require("./db")();
const express = require("express");
const app = express();
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
const usersRouter = require("./Controllers/user.controller");
var router = express.Router(); 
app.use('/users/', usersRouter);










const port= process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`localhost:${port} -> api working !!! `);
});

module.exports = app;






