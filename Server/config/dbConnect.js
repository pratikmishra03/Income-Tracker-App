const mongoose=require('mongoose');
const mongoURL='mongodb://127.0.0.1:27017/Income-Expense-Tracker';
//connect
const dbConnect=async()=>{
    try{
         await mongoose.connect(mongoURL,{UseNewUrlParser:true,
            useUnifiedTopology:true  
    });
         console.log('Db connected successfully');
    }catch(e){
        console.log(e.message);
        process.exit(1);
    }
}
dbConnect()
// pratikmishra08314
// K4Y33a6LhmRcBfqm 