const db = require("./db")();
const express = require("express");
var cors = require('cors')

const app = express();
var path = require('path');
var bodyParser = require('body-parser')
var auhtguardAdmin=require('./Controllers/authguard.admin')
var auhtguardUser=require('./Controllers/authguard.user')
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
const usersRouter = require("./Controllers/user.controller");
const activityRouter = require("./Controllers/activity.controller");
const activityViewRouter = require("./Controllers/activity-view.controller");
const activityCommentRouter = require("./Controllers/activity.comment");
const activityManagementRouter = require("./Controllers/activity.management.controller");
const loginRouter = require('./Controllers/login.controller');
const communicationRouter = require("./Controllers/communication.controller");
const adminRouter = require("./Controllers/admin.controller");

var router = express.Router(); 
// app.use('/users/',auhtguard, usersRouter);
app.use('/users/', auhtguardUser,usersRouter);
app.use('/activity-view/',activityViewRouter)
app.use('/activity/',auhtguardUser,activityRouter); //auth controlu yapiliyor
app.use('/activity-comment/',auhtguardUser,activityCommentRouter); 
app.use('/activity-management/',activityManagementRouter);
app.use('/login/',loginRouter)
app.use('/communication/', communicationRouter);

app.use('/admin/', auhtguardAdmin,adminRouter);
//app.use('/activity/',activityRouter);

const port= process.env.PORT || 3000;
var server =app.listen(port, () => {
  console.log(`localhost:${port} -> api working !!! `);
});


var io = require('socket.io').listen(server);

//var path = __dirname + '/views/';

var usersCollection = [];

// Express routes
app.set("view engine", "vash");

app.use("/Uploads", express.static(path.join(__dirname, 'Uploads')));

app.get("*",function(req, res){
  res.render("index");
});

app.post("/listFriends",function(req, res){
  var clonedArray = usersCollection.slice();

  // Getting the userId from the request body as this is just a demo 
  // Ideally in a production application you would change this to a session value or something else
  var i = usersCollection.findIndex(x => x.participant.id == req.body.userId);

  clonedArray.splice(i,1);

  res.json(clonedArray);
});

app.post('/uploadFile', function (req, res){
  let form = new formidable.IncomingForm();
  let ngChatDestinataryUserId;

  if (!fs.existsSync("/Uploads")){
    fs.mkdirSync("/Uploads");
  }
  
  form.parse(req)
  .on('field', function (name, field) {
    // You must always validate this with your backend logic
    if (name === 'ng-chat-participant-id')
      ngChatDestinataryUserId = field;
  })
  .on('fileBegin', function (name, file){
      file.path = `${__dirname}/Uploads/${file.name}`;
  })
  .on('file', function (name, file){
    console.log('Uploaded ' + file.name);

    // Push socket IO status
    let message = {
      type: 2, // MessageType.File = 2
      //fromId: ngChatSenderUserId, fromId will be set by the angular component after receiving the http response
      toId: ngChatDestinataryUserId,
      message: file.name,
      mimeType: file.type,
      fileSizeInBytes: file.size,
      downloadUrl:  `http://localhost:3000/Uploads/${file.name}`
    };

    console.log("Returning file message:");
    console.log(message);

    res.status(200);
    res.json(message);
  });
});

// Socket.io operations
io.on('connection', function(socket){
  console.log('A user has connected to the server.');

  socket.on('join', function(username) {
    // Same contract as ng-chat.User


    usersCollection.push({
        participant: {
            id: socket.id, // Assigning the socket ID as the user ID in this example
            displayName: username,
            status: 0, // ng-chat UserStatus.Online,
            avatar: "https://media-exp1.licdn.com/dms/image/C4D03AQFTf2NXO-G_oA/profile-displayphoto-shrink_200_200/0?e=1606348800&v=beta&t=bFQ4I2TBYb0H-hxkmgJ2YtpvCYu8_1_P7BdG5o9bwEg"
        }
    });

    socket.broadcast.emit("friendsListChanged", usersCollection);

//    console.log(username + " has joined the chat room.");

    // This is the user's unique ID to be used on ng-chat as the connected user.
    socket.emit("generatedUserId", socket.id);

    // On disconnect remove this socket client from the users collection
    socket.on('disconnect', function() {
      console.log('User disconnected!');

      var i = usersCollection.findIndex(x => x.participant.id == socket.id);
      usersCollection.splice(i, 1);

      socket.broadcast.emit("friendsListChanged", usersCollection);
   });
  });

  socket.on("sendMessage", function(message){
    console.log("Message received:");
 //   console.log(message);

 //   console.log(usersCollection.find(x => x.participant.id == message.fromId));

    io.to(message.toId).emit("messageReceived", {
      user: usersCollection.find(x => x.participant.id == message.fromId).participant,
      message: message
    });

 //   console.log("Message dispatched.");
  });
});

module.exports = app;  






