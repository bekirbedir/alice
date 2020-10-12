const mongoose=require('mongoose');

module.exports= () =>{
 //   mongoose.connect('mongodb+srv://alice:alice@activity.b03go.mongodb.net/Activity?retryWrites=true&w=majority', {useUnifiedTopology: true,useNewUrlParser: true,useCreateIndex: true,useFindAndModify: false});
    mongoose.connect('mongodb://alice:Alice.123@localhost:27017/alice?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256', {useUnifiedTopology: true,useNewUrlParser: true,useCreateIndex: true,useFindAndModify: false}); 

 mongoose.connection.on('open', ()=>{
        console.log("Db Connected");
    })
    
}


