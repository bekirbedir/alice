const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser')
var crypto = require('crypto');
let User=require("../Models/user")
let mailler=require("../mailler")
var jwt = require('jsonwebtoken');

module.exports = router;


