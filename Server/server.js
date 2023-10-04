const express = require('express');
const cors=require('cors');
require('./config/dbConnect')
const usersRoute = require('./routes/users/usersRoute');
const accountRoute = require('./routes/accounts/accountRoute');
const transactionsRoute = require('./routes/transactions/transactionsRoute');
const globalErrHandler = require('./middlewares/globalErrHandler');


const app = express();

//!middlewares
app.use(express.json());  //Pass incoming Data

//!corsmiddleware
app.use(cors());


//*----------routes-------------
//!------users routes  

app.use('/api/v1/users',usersRoute);

//!-----Accouct routes
app.use("/api/v1/accounts",accountRoute);

//!-----Transactions routes
app.use("/api/v1/transactions",transactionsRoute);


//Error handlers
app.use(globalErrHandler);



//Listen to Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});