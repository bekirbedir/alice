const mongoose=require('mongoose');

module.exports= () =>{
    mongoose.connect('mongodb+srv://alicetest:alicetest@cluster0-gkp6j.mongodb.net/video?retryWrites=true&w=majority', {useUnifiedTopology: true,useNewUrlParser: true,useCreateIndex: true,useFindAndModify: false});
    mongoose.connection.on('open', ()=>{
        
        console.log("Db Connected");
       
    })
}


