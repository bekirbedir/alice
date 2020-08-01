const mongoose=require('mongoose');

module.exports= () =>{
    mongoose.connect('mongodb+srv://alice:alice@activity.b03go.mongodb.net/Activity?retryWrites=true&w=majority', {useUnifiedTopology: true,useNewUrlParser: true,useCreateIndex: true,useFindAndModify: false});
    mongoose.connection.on('open', ()=>{
        
        console.log("Db Connected");
       
    })
}


