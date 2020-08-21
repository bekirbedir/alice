const db = require("./db")();
const express = require("express");
var cors = require('cors')

const app = express();
var path = require('path');
var bodyParser = require('body-parser')
var auhtguard=require('./Controllers/user.authguard')
app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const usersRouter = require("./Controllers/user.controller");
const activityRouter = require("./Controllers/activity.controller");
const activityViewRouter = require("./Controllers/activity-view.controller");
const activityCommentRouter = require("./Controllers/activity.comment");
var router = express.Router(); 
// app.use('/users/',auhtguard, usersRouter);
app.use('/users/', usersRouter);
app.use('/activity-view/',activityViewRouter)
app.use('/activity/',auhtguard,activityRouter); //auth controlu yapiliyor
app.use('/activity-comment/',auhtguard,activityCommentRouter); 
//app.use('/activity/',activityRouter);

const port= process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`localhost:${port} -> api working !!! `);
});

module.exports = app;  






